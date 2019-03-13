import * as bodyParser from 'body-parser';
import * as cookieParser from 'cookie-parser';
import * as express from 'express';
import * as expressSession from 'express-session';
import {existsSync, mkdirSync, readFileSync} from 'fs';
import * as https from 'https';
import {get} from 'https';
import {createTransport} from 'nodemailer';
import * as passport from 'passport';
import {Strategy} from 'passport-google-oauth2';
import {join} from 'path';
import {cwd} from 'process';
import {exec, which} from 'shelljs';
import {
  decorateDevices,
  disableMotion,
  enableMotion,
  getDevicesOnNetwork,
  isLoggedIn,
  saveMotionConf,
  saveSettings,
  saveTrustedDevices,
} from './common';
import {
  isMotionAPITrustedDevice,
  MOTION_MODES,
  MotionAPIAbstractDevice,
  MotionAPITrustedDevicesList,
  MotionAPITrustRequest,
  MotionSettingsSensibleDefaults,
  SETTINGS_META_DATA,
} from './types';

const config = JSON.parse(readFileSync(join(cwd(), 'config', 'config.json')).toString());

// check if `arp-scan` is installed
if (which('arp-scan') === null) {
  throw new Error('Please install `arp-scan` to continue!');
}

// check if `motion` is installed
if (which('motion') === null) {
  throw new Error('Please install `motion` to continue!');
}

if (!existsSync(join(cwd(), 'config', 'cert.pem')) || !existsSync(join(cwd(), 'config', 'key.pem'))) {
  throw new Error(
    'Please supply an SSL certiticate!\n'
    + 'You can automatically generate one with the following command!\n'
    + 'openssl req -x509 -newkey rsa:4096 -keyout ' + join(cwd(), 'config', 'key.pem') + '' +
    '-out ' + join(cwd(), 'config', 'cert.pem') + ' -days 3650 -nodes',
  );
}

if (!existsSync(join(cwd(), 'config', 'config.json'))) {
  throw new Error('Please supply a config file!');
}

if (!existsSync(join(cwd(), 'config'))) {
  mkdirSync('config');
}

if (!existsSync(join(cwd(), 'database'))) {
  mkdirSync('database');
}

if (!existsSync(join(cwd(), 'database', 'events'))) {
  mkdirSync(join(cwd(), 'database', 'events'));
}

const transporter = createTransport({
  auth: {
    pass: config.smtp.pass,
    user: config.smtp.user,
  },
  host: 'smtp.gmail.com',
  secure: true,
});

transporter.verify((err) => {
  if (err) {
    throw err;
  }
});

// map of settings
let settings: any = {};

// list of devices, active and trusted
let devices: MotionAPIAbstractDevice[] = [];

// map of trusted devices
let trustedDevices: MotionAPITrustedDevicesList = {};

// current mode
let mode = 'auto';

// count of scans without a trusted device in the list
let scanMissCount = 0;

// whether the camera is enabled at the moment or not
let cameraEnabled = false;

// check if we have saved settings
if (existsSync(cwd() + '/database/motionSettings.json')) {
  // load saved settings
  settings = JSON.parse(readFileSync(join(cwd(), 'database', 'motionSettings.json')).toString());
} else {
  // create initial settings and save them
  settings = new MotionSettingsSensibleDefaults();
  saveSettings(settings);
}

// initialize motion configuration
saveMotionConf(settings);

// load trusted devices
if (existsSync(cwd() + '/database/trustedDevices.json')) {
  trustedDevices = JSON.parse(readFileSync(join(cwd(), 'database', 'trustedDevices.json')).toString());
}

/**
 * Scan network for trusted devices
 */
function scan() {
  getDevicesOnNetwork((err, activeDevices) => {
    if (err) {
      throw err;
    }

    devices = decorateDevices(activeDevices, trustedDevices);

    let trustedActiveDeviceFound = false;
    devices.forEach((device) => {
      if (isMotionAPITrustedDevice(device)) {
        trustedActiveDeviceFound = true;
      }
    });

    if (trustedActiveDeviceFound) {
      scanMissCount = 0;

      if (mode === 'auto' && cameraEnabled) {
        disableMotion((disableErr, msg) => {
          if (disableErr) {
            throw disableErr;
          }

          /* tslint:disable:no-console */
          console.info(msg);
          cameraEnabled = false;
        });
      }
    } else {
      scanMissCount++;

      if (scanMissCount >= settings._missesConsideredOffline && mode === 'auto' && !cameraEnabled) {
        enableMotion((enableErr, msg) => {
          if (enableErr) {
            console.error(enableErr);
            return;
          }

          console.info(msg);
          cameraEnabled = true;
        });
      }
    }
  });

  setTimeout(scan, settings._scanTimeout);
}

// start to scan
scan();

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
  secret: config.google.clientSecret,
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
  config.google,
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
app.get('/api/mode', isLoggedIn, (_request, result) => {
  result.send({status: true, data: mode});
});

// define route to get the status
app.get('/api/status', isLoggedIn, (_request, result) => {
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
app.get('/api/settings', isLoggedIn, (_request, result) => {
  result.send([
    'rotate',
    '_scanTimeout',
    '_missesConsideredOffline',
    'framerate',
    'threshold',
  ].map((key) => {
    return {
      description: SETTINGS_META_DATA[key].description,
      key: key,
      title: SETTINGS_META_DATA[key].title,
      value: settings[key],
      values: SETTINGS_META_DATA[key].values,
    };
  }));
});

// define route to get the devices
app.get('/api/devices', isLoggedIn, (_request, result) => {
  result.send({status: true, data: devices});
});

// define route to set the mode
app.post('/api/mode', isLoggedIn, bodyParser.json(), (request, result) => {
  const newMode = request.body.mode;

  if (MOTION_MODES.indexOf(mode) >= 0) {
    if (newMode === 'on' && mode !== 'on' && !cameraEnabled) {
      enableMotion((err, msg) => {
        if (err) {
          console.error(err);
          return;
        }

        console.info(msg);
        cameraEnabled = true;
      });
    }

    if (newMode === 'off' && mode !== 'off' && cameraEnabled) {
      disableMotion((err, msg) => {
        if (err) {
          console.error(err);
          return;
        }

        console.info(msg);
        cameraEnabled = false;
      });
    }

    mode = newMode;

    result.send({status: true});
    return;
  }

  result.send({status: true});
});

// define route to set the settings
app.post('/api/settings', isLoggedIn, bodyParser.json(), (request, result) => {
  if (typeof settings[request.body.key] !== 'undefined') {
    settings[request.body.key] = request.body.value;
    saveSettings(settings);
    saveMotionConf(settings);
    result.send({status: true});
    return;
  }

  result.send({status: false});
});

// define route to trust a device
app.post('/api/devices/trust', isLoggedIn, bodyParser.json(), (request, result) => {
  devices.forEach((device) => {
    if (device.mac === request.body.mac) {
      trustedDevices[request.body.mac] = request.body;
    }
  });

  devices = decorateDevices(devices, trustedDevices);

  saveTrustedDevices(trustedDevices);

  result.send({status: true});
});

// define route to untrust a device
app.post('/api/devices/untrust', isLoggedIn, bodyParser.json(), (request: { body: MotionAPITrustRequest }, result) => {
  if (typeof trustedDevices[request.body.mac] !== 'undefined') {
    delete trustedDevices[request.body.mac];

    devices = decorateDevices(devices, trustedDevices);

    saveTrustedDevices(trustedDevices);

    result.send({status: true});

    return;
  }

  result.send({status: false});
});

// serve app
app.use('/app', isLoggedIn, express.static(join(cwd(), '..', 'app', 'www')));

// serve images
app.use('/images', isLoggedIn, express.static(join(cwd(), 'database', 'images')));

// start https server
https.createServer({
  cert: readFileSync(join(cwd(), 'config', 'cert.pem')),
  key: readFileSync(join(cwd(), 'config', 'key.pem')),
}, app).listen(3000, () => {
  console.info('Server running...');
});

function updateExternalIP() {
  get(config.dynDnsUpdateUrl, (res) => {
    res.on('data', (d) => {
      process.stdout.write(d);
    });

  }).on('error', (e) => {
    console.error(e);
  });
}

setInterval(updateExternalIP, 600000);
updateExternalIP();
