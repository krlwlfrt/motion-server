import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as expressSession from 'express-session';
import {existsSync, mkdirSync, readFileSync} from 'fs';
import * as https from 'https';
import {createTransport} from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';
import * as passport from 'passport';
import {Strategy} from 'passport-google-oauth2';
import {basename, join, resolve} from 'path';
import {cwd} from 'process';
import * as requestPromiseNative from 'request-promise-native';
import {exec, which} from 'shelljs';
import {promisify} from 'util';
import {
  decorateDevices,
  disableMotion,
  enableMotion,
  eventsPath,
  getDevicesOnNetwork,
  loadConfig,
  loadSettings,
  loadTrustedDevices,
  readdirPromisified,
  readFilePromisified,
  saveMotionConfig,
  saveSettings,
  saveTrustedDevices,
} from './common';
import {SETTINGS_META_DATA} from './config';
import {
  MotionAPIRequest,
  MotionAPIResponse,
  MotionAPITrustRequest,
  MotionAPIUntrustRequest,
  MotionMode,
  NetworkDevice,
} from './types';

export class Server {
  activeDevices: NetworkDevice[] = [];
  cameraEnabled = false;
  config = loadConfig();
  devices: NetworkDevice[] = [];
  mode: MotionMode = MotionMode.auto;
  scanMissCount = 0;
  settings = loadSettings();
  transporter: Mail;
  trustedDevices = loadTrustedDevices();

  constructor() {
    // check if `arp-scan` is installed
    if (which('arp-scan') === null) {
      throw new Error('Please install `arp-scan` to continue!');
    }

    // check if `motion` is installed
    if (which('motion') === null) {
      throw new Error('Please install `motion` to continue!');
    }

    if (!existsSync(resolve(__dirname, '..', 'config', 'cert.pem'))
      || !existsSync(resolve(__dirname, '..', 'config', 'key.pem'))) {
      throw new Error(
        `Please supply an SSL certiticate!
You can automatically generate one with the following command!
openssl req -x509 -newkey rsa:4096 -keyout ${resolve(__dirname, '..', 'config', 'key.pem')}
-out ${resolve(__dirname, '..', 'config', 'cert.pem')} -days 3650 -nodes`,
      );
    }

    if (!existsSync(resolve(__dirname, '..', 'config', 'config.json'))) {
      throw new Error('Please supply a config file!');
    }

    if (!existsSync(resolve(__dirname, '..', 'database', 'events'))) {
      mkdirSync(resolve(__dirname, '..', 'database', 'events'), {recursive: true});
    }

    // create transport - has been verified on server startup
    this.transporter = createTransport({
      auth: {
        pass: this.config.smtp.pass,
        user: this.config.smtp.user,
      },
      host: 'smtp.gmail.com',
      secure: true,
    });
  }

  /**
   * Check disk space
   */
  async checkDiskSpace(): Promise<void> {
    setTimeout(async () => {
      await this.checkDiskSpace();
    }, 24 * 60 * 60 * 1000);

    const df = require('df');
    const dfPromisified = promisify(df);

    const space = await dfPromisified();

    const rootEntry = space.find((entry: any) => {
      return entry.mountpoint === '/';
    });

    if (rootEntry.percent > 90) {
      const message = {
        from: this.config.smtp.user,
        subject: '[Motion] Disk space warning',
        text: `Disk space usage is at ${rootEntry.percent}%!
Please free up space on the disk soon!`,
        to: this.config.allowedEmails,
      };

      await this.transporter.sendMail(message);
    }
  }

  /**
   * Check if the session is logged in
   *
   * @param req
   * @param res
   * @param next
   */
  isLoggedIn(req: express.Request, res: express.Response, next: express.NextFunction): void {
    if (req.hostname === 'localhost') {
      next();
      return;
    }

    if (req.user) {
      if (this.config.allowedEmails.indexOf(req.user.email) === -1) {
        res.sendStatus(403);
      } else {
        next();
      }
    } else {
      res.redirect('/auth/google');
    }
  }

  /**
   * Scan network for trusted devices
   */
  async scanNetwork() {
    setTimeout(async () => {
      await this.scanNetwork();
      // @ts-ignore TODO
    }, this.settings._scanTimeout * 1000);

    if (this.mode === MotionMode.auto) {
      try {
        this.activeDevices = await getDevicesOnNetwork();
      } catch (error) {
        console.error(error);
      }

      this.devices = decorateDevices(this.activeDevices, this.trustedDevices);

      const trustedDeviceActive = this.devices.some((device) => {
        return typeof device.trusted === 'boolean' && device.trusted;
      });

      if (trustedDeviceActive) {
        this.scanMissCount = 0;

        if (this.cameraEnabled) {
          const msg = await disableMotion();
          console.info(msg);
          this.cameraEnabled = false;
        }
      } else {
        this.scanMissCount++;

        // @ts-ignore TODO
        if (this.scanMissCount >= this.settings._missesConsideredOffline && !this.cameraEnabled) {
          const msg = await enableMotion();
          console.info(msg);
          this.cameraEnabled = true;
        }
      }
    }
  }

  /**
   * Start the server
   */
  async start(): Promise<void> {
    // initialize motion configuration
    await saveMotionConfig(this.settings);

    await this.transporter.verify();

    // initialize express
    const app = express();

    // use cookie parser
    app.use(cookieParser());

    // use body parser
    app.use(bodyParser.urlencoded({extended: true}));

    // use express session
    app.use(expressSession({
      resave: false,
      saveUninitialized: false,
      secret: this.config.google.clientSecret,
    }));

    // initialize passport
    app.use(passport.initialize());

    // initialize passport session
    app.use(passport.session());

    // define how to serialize a user
    passport.serializeUser((user: any, done) => {
      done(null, JSON.stringify(user));
    });

    // define how to deserialize a user
    passport.deserializeUser((user: string, done) => {
      done(null, JSON.parse(user));
    });

    // configure google oauth2 passport strategy
    passport.use(new Strategy(
      this.config.google,
      (_accessToken, _refreshToken, profile, done) => {
        done(null, profile);
      }));

    // define route for login
    app.get('/auth/google', passport.authenticate('google', {}));

    // define route for login callback
    app.get('/auth/google/callback', passport.authenticate('google', {
      failureRedirect: '/auth/google',
      successRedirect: '/app',
    }));

    // define route to get the mode
    app.get('/api/mode', (req, res, next) => {
      this.isLoggedIn(req, res, next);
    }, (_request, result) => {
      result.send({status: true, data: this.mode});
    });

    // define route to get the status
    app.get('/api/status', (req, res, next) => {
      this.isLoggedIn(req, res, next);
    }, (_request, result) => {
      exec('ps cax | grep motion', {silent: true}, (code, stdOut, stdErr) => {
        if (stdErr) {
          throw new Error(stdErr);
        }

        if (code === 0 && stdOut.indexOf('motion') >= 0) {
          result.send({status: true});
          return;
        }

        result.send({status: false});
      });
    });

    // define route to get the settings
    app.get('/api/settings', (req, res, next) => {
      this.isLoggedIn(req, res, next);
    }, (_request, result) => {
      result.send(Object.keys(SETTINGS_META_DATA).map((key) => {
        return {
          description: SETTINGS_META_DATA[key].description,
          key: key,
          title: SETTINGS_META_DATA[key].title,
          value: this.settings[key],
          values: SETTINGS_META_DATA[key].values,
        };
      }));
    });

    // define route to get the devices
    app.get('/api/devices', (req, res, next) => {
      this.isLoggedIn(req, res, next);
    }, (_request, result) => {
      result.send({status: true, data: this.devices});
    });

    // define route to set the mode
    app.post('/api/mode', (req, res, next) => {
      this.isLoggedIn(req, res, next);
    }, bodyParser.json(), async (request, result) => {
      const mode = request.body.mode;

      if (Object.values(MotionMode).includes(mode)) {
        if (mode === MotionMode.on && this.mode !== MotionMode.on && !this.cameraEnabled) {
          const msg = await enableMotion();

          console.info(msg);
          this.cameraEnabled = true;
        }

        if (mode === MotionMode.off && this.mode !== MotionMode.off && this.cameraEnabled) {
          const msg = await disableMotion();

          console.info(msg);
          this.cameraEnabled = false;
        }

        this.mode = mode;

        result.send({status: true});
        return;
      }

      result.send({status: true});
    });

    // define route to set the settings
    app.post(
      '/api/settings',
      (req, res, next) => {
        this.isLoggedIn(req, res, next);
      },
      bodyParser.json(),
      async (request: MotionAPIRequest<{ key: string; value: any; }>, result) => {
        if (typeof this.settings[request.body.key] !== 'undefined') {
          this.settings[request.body.key] = request.body.value;

          await saveSettings(this.settings);
          await saveMotionConfig(this.settings);

          result.send({status: true});
          return;
        }

        result.send({status: false});
      },
    );

    // define route to trust a device
    app.post(
      '/api/devices/trust',
      (req, res, next) => {
        this.isLoggedIn(req, res, next);
      },
      bodyParser.json(),
      async (request: MotionAPIRequest<MotionAPITrustRequest>, result) => {
        this.devices.some((device) => {
          if (device.mac === request.body.mac) {
            this.trustedDevices.push(request.body);
            return true;
          }

          return false;
        });

        this.devices = decorateDevices(this.devices, this.trustedDevices);

        await saveTrustedDevices(this.trustedDevices);

        result.send({status: true});
      },
    );

    // define route to untrust a device
    app.post(
      '/api/devices/untrust',
      (req, res, next) => {
        this.isLoggedIn(req, res, next);
      },
      bodyParser.json(),
      async (request: MotionAPIRequest<MotionAPIUntrustRequest>, result) => {
        const index = this.trustedDevices.findIndex((trustedDevice) => {
          return trustedDevice.mac === request.body.mac;
        });

        if (index >= 0) {
          this.trustedDevices.splice(index, 1);

          this.devices = decorateDevices(this.devices, this.trustedDevices);

          await saveTrustedDevices(this.trustedDevices);

          result.send({status: true});

          return;
        }

        result.send({status: false});
      },
    );

    app.get(
      '/api/events',
      (req, res, next) => {
        this.isLoggedIn(req, res, next);
      },
      bodyParser.json(),
      async (_request, result) => {
        const files = await readdirPromisified(eventsPath);

        const response: MotionAPIResponse<number[]> = {
          data: files.map((file) => parseInt(basename(file), 10)),
          status: true,
        };

        result.send(response);
      },
    );

    app.get(
      '/api/events/:event',
      (req, res, next) => {
        this.isLoggedIn(req, res, next);
      },
      bodyParser.json(),
      async (req, res) => {
        const requestedEvent = join(eventsPath, req.param('event'));

        if (!existsSync(requestedEvent)) {
          res.send({status: false});
          return;
        }

        const response: MotionAPIResponse<number[]> = {
          data: JSON.parse((await readFilePromisified(requestedEvent)).toString()),
          status: true,
        };

        res.send(response);
      },
    );

    // serve app
    app.use('/app', (req, res, next) => {
      this.isLoggedIn(req, res, next);
    }, express.static(join(cwd(), '..', 'app', 'www')));

    // serve images
    app.use('/images', (req, res, next) => {
      this.isLoggedIn(req, res, next);
    }, express.static(join(cwd(), 'database', 'images')));

    // start https server
    https.createServer({
      cert: readFileSync(join(cwd(), 'config', 'cert.pem')),
      key: readFileSync(join(cwd(), 'config', 'key.pem')),
    }, app).listen(3000, () => {
      console.info('Server running...');
    });

    await this.checkDiskSpace();

    await this.scanNetwork();

    await this.updateExternalIP();
  }

  /**
   * Update external IP
   */
  async updateExternalIP(): Promise<void> {
    setTimeout(async () => {
      await this.updateExternalIP();
    }, 10 * 60 * 1000);

    try {
      const msg = await requestPromiseNative(this.config.dynDnsUpdateUrl);
      console.info(msg);
    } catch (e) {
      console.error(e, e.message);
    }
  }
}
