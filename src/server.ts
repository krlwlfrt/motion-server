import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as expressSession from 'express-session';
import {existsSync, mkdirSync, readFileSync} from 'fs';
import * as https from 'https';
import * as passport from 'passport';
import {Strategy} from 'passport-google-oauth2';
import {basename, join, resolve} from 'path';
import {cwd} from 'process';
import * as requestPromiseNative from 'request-promise-native';
import {exec, which} from 'shelljs';
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
  }

  /**
   * Check if the session is logged in
   *
   * @param req
   * @param res
   * @param next
   */
  isLoggedIn(req: express.Request, res: express.Response, next: () => void): void {
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
  async scan() {
    setTimeout(async () => {
      await this.scan();
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

  async start(): Promise<void> {
    // initialize motion configuration
    await saveMotionConfig(this.settings);

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
    app.get('/api/mode', this.isLoggedIn, (_request, result) => {
      result.send({status: true, data: this.mode});
    });

    // define route to get the status
    app.get('/api/status', this.isLoggedIn, (_request, result) => {
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
    app.get('/api/settings', this.isLoggedIn, (_request, result) => {
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
    app.get('/api/devices', this.isLoggedIn, (_request, result) => {
      result.send({status: true, data: this.devices});
    });

    // define route to set the mode
    app.post('/api/mode', this.isLoggedIn, bodyParser.json(), async (request, result) => {
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
      this.isLoggedIn,
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
      this.isLoggedIn,
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
      this.isLoggedIn,
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
      this.isLoggedIn,
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
      this.isLoggedIn,
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
    app.use('/app', this.isLoggedIn, express.static(join(cwd(), '..', 'app', 'www')));

    // serve images
    app.use('/images', this.isLoggedIn, express.static(join(cwd(), 'database', 'images')));

    // start https server
    https.createServer({
      cert: readFileSync(join(cwd(), 'config', 'cert.pem')),
      key: readFileSync(join(cwd(), 'config', 'key.pem')),
    }, app).listen(3000, () => {
      console.info('Server running...');
    });

    // await this.updateExternalIP();

    await this.scan();
  }

  /**
   * Update external IP
   */
  async updateExternalIP(): Promise<void> {
    await requestPromiseNative(this.config.dynDnsUpdateUrl);

    setInterval(async () => {
      await this.updateExternalIP();
    }, 10 * 60 * 1000);
  }
}
