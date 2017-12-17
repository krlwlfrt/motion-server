"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const fs_1 = require("fs");
const https = require("https");
const https_1 = require("https");
const nodemailer_1 = require("nodemailer");
const passport = require("passport");
const passport_google_oauth2_1 = require("passport-google-oauth2");
const path_1 = require("path");
const process_1 = require("process");
const shelljs_1 = require("shelljs");
const common_1 = require("./common");
const types_1 = require("./types");
const config = require(path_1.join(process_1.cwd(), 'config', 'config.json'));
// check if `arp-scan` is installed
if (shelljs_1.which('arp-scan') === null) {
    console.error('Please install `arp-scan` to continue!');
    process.exit(1);
}
// check if `motion` is installed
if (shelljs_1.which('motion') === null) {
    console.error('Please install `motion` to continue!');
    process.exit(1);
}
if (!fs_1.existsSync(path_1.join(process_1.cwd(), 'config', 'cert.pem')) || !fs_1.existsSync(path_1.join(process_1.cwd(), 'config', 'key.pem'))) {
    console.error('Please supply an SSL certiticate!');
    console.log('You can automatically generate one with the following command!');
    /* tslint:disable:max-line-length */
    console.log('openssl req -x509 -newkey rsa:4096 -keyout ' + path_1.join(process_1.cwd(), 'config', 'key.pem') + ' -out ' + path_1.join(process_1.cwd(), 'config', 'cert.pem') + ' -days 3650 -nodes');
    /* tslint:enable */
    process.exit(1);
}
if (!fs_1.existsSync(path_1.join(process_1.cwd(), 'config', 'config.json'))) {
    console.error('Please supply a config file!');
    process.exit(1);
}
if (!fs_1.existsSync(path_1.join(process_1.cwd(), 'config'))) {
    fs_1.mkdirSync('config');
}
if (!fs_1.existsSync(path_1.join(process_1.cwd(), 'database'))) {
    fs_1.mkdirSync('database');
}
if (!fs_1.existsSync(path_1.join(process_1.cwd(), 'database', 'events'))) {
    fs_1.mkdirSync(path_1.join(process_1.cwd(), 'database', 'events'));
}
const transporter = nodemailer_1.createTransport({
    auth: {
        pass: config.smtp.pass,
        user: config.smtp.user
    },
    host: 'smtp.gmail.com',
    secure: true
});
transporter.verify((err) => {
    if (err) {
        console.error(err);
        process.exit(1);
    }
});
// map of settings
let settings = {};
// list of devices, active and trusted
let devices = [];
// map of trusted devices
let trustedDevices = {};
// current mode
let mode = 'auto';
// count of scans without a trusted device in the list
let scanMissCount = 0;
// whether the camera is enabled at the moment or not
let cameraEnabled = false;
// check if we have saved settings
if (fs_1.existsSync(process_1.cwd() + '/database/motionSettings.json')) {
    // load saved settings
    settings = require(process_1.cwd() + '/database/motionSettings.json');
}
else {
    // create initial settings and save them
    settings = new types_1.MotionSettingsSensibleDefaults();
    common_1.saveSettings(settings);
}
// initialize motion configuration
common_1.saveMotionConf(settings);
// load trusted devices
if (fs_1.existsSync(process_1.cwd() + '/database/trustedDevices.json')) {
    trustedDevices = require(process_1.cwd() + '/database/trustedDevices.json');
}
/**
 * Scan network for trusted devices
 */
function scan() {
    common_1.getDevicesOnNetwork((err, activeDevices) => {
        devices = common_1.decorateDevices(activeDevices, trustedDevices);
        let trustedActiveDeviceFound = false;
        devices.forEach((device) => {
            if (device.trusted && device.ip) {
                trustedActiveDeviceFound = true;
            }
        });
        if (trustedActiveDeviceFound) {
            scanMissCount = 0;
            if (mode === 'auto' && cameraEnabled) {
                common_1.disableMotion((disableErr, msg) => {
                    if (disableErr) {
                        console.error(disableErr);
                        return;
                    }
                    console.info(msg);
                    cameraEnabled = false;
                });
            }
        }
        else {
            scanMissCount++;
            if (scanMissCount >= settings._missesConsideredOffline && mode === 'auto' && !cameraEnabled) {
                common_1.enableMotion((enableErr, msg) => {
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
app.use(bodyParser.urlencoded({ extended: true }));
// use express session
app.use(require('express-session')({
    resave: false,
    saveUninitialized: false,
    secret: config.google.clientSecret
}));
// initialize passport
app.use(passport.initialize());
// initialize passport session
app.use(passport.session());
// define how to serialize a user
passport.serializeUser((user, done) => {
    done(null, JSON.stringify(user));
});
// define how to deserialize a user
passport.deserializeUser((user, done) => {
    done(null, JSON.parse(user));
});
// configure google oauth2 passport strategy
passport.use(new passport_google_oauth2_1.Strategy(config.google, (accessToken, refreshToken, profile, done) => {
    done(null, profile);
}));
// define route for login
app.get('/auth/google', passport.authenticate('google', {}));
// define route for login callback
app.get('/auth/google/callback', passport.authenticate('google', {
    failureRedirect: '/auth/google',
    successRedirect: '/app'
}));
// define route to get the mode
app.get('/api/mode', common_1.isLoggedIn, (request, result) => {
    result.send({ status: true, data: mode });
});
// define route to get the status
app.get('/api/status', common_1.isLoggedIn, (request, result) => {
    shelljs_1.exec('ps cax | grep motion', { silent: true }, (code, stdOut, stdErr) => {
        if (code === 0 && stdOut.indexOf('motion') >= 0) {
            result.send({ status: true });
            return;
        }
        result.send({ status: false });
    });
});
// define route to get the settings
app.get('/api/settings', common_1.isLoggedIn, (request, result) => {
    result.send([
        'rotate',
        '_scanTimeout',
        '_missesConsideredOffline',
        'framerate',
        'threshold'
    ].map((key) => {
        return {
            description: types_1.SETTINGS_META_DATA[key].description,
            key: key,
            title: types_1.SETTINGS_META_DATA[key].title,
            value: settings[key],
            values: types_1.SETTINGS_META_DATA[key].values
        };
    }));
});
// define route to get the devices
app.get('/api/devices', common_1.isLoggedIn, (request, result) => {
    result.send({ status: true, data: devices });
});
// define route to set the mode
app.post('/api/mode', common_1.isLoggedIn, bodyParser.json(), (request, result) => {
    const newMode = request.body.mode;
    if (types_1.MOTION_MODES.indexOf(mode) >= 0) {
        if (newMode === 'on' && mode !== 'on' && !cameraEnabled) {
            common_1.enableMotion((err, msg) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.info(msg);
                cameraEnabled = true;
            });
        }
        if (newMode === 'off' && mode !== 'off' && cameraEnabled) {
            common_1.disableMotion((err, msg) => {
                if (err) {
                    console.error(err);
                    return;
                }
                console.info(msg);
                cameraEnabled = false;
            });
        }
        mode = newMode;
        result.send({ status: true });
        return;
    }
    result.send({ status: true });
});
// define route to set the settings
app.post('/api/settings', common_1.isLoggedIn, bodyParser.json(), (request, result) => {
    if (typeof settings[request.body.key] !== 'undefined') {
        settings[request.body.key] = request.body.value;
        common_1.saveSettings(settings);
        common_1.saveMotionConf(settings);
        result.send({ status: true });
        return;
    }
    result.send({ status: false });
});
// define route to trust a device
app.post('/api/devices/trust', common_1.isLoggedIn, bodyParser.json(), (request, result) => {
    devices.forEach((device) => {
        if (device.mac === request.body.mac) {
            trustedDevices[request.body.mac] = request.body;
        }
    });
    devices = common_1.decorateDevices(devices, trustedDevices);
    common_1.saveTrustedDevices(trustedDevices);
    result.send({ status: true });
});
// define route to untrust a device
app.post('/api/devices/untrust', common_1.isLoggedIn, bodyParser.json(), (request, result) => {
    if (typeof trustedDevices[request.body.mac] !== 'undefined') {
        delete trustedDevices[request.body.mac];
        devices = common_1.decorateDevices(devices, trustedDevices);
        common_1.saveTrustedDevices(trustedDevices);
        result.send({ status: true });
        return;
    }
    result.send({ status: false });
});
// serve app
app.use('/app', common_1.isLoggedIn, express.static(path_1.join(process_1.cwd(), '..', 'app', 'www')));
// serve images
app.use('/images', common_1.isLoggedIn, express.static(path_1.join(process_1.cwd(), 'database', 'images')));
// start https server
https.createServer({
    cert: fs_1.readFileSync(path_1.join(process_1.cwd(), 'config', 'cert.pem')),
    key: fs_1.readFileSync(path_1.join(process_1.cwd(), 'config', 'key.pem'))
}, app).listen(3000, () => {
    console.info('Server running...');
});
function updateExternalIP() {
    https_1.get(config.dynDnsUpdateUrl, (res) => {
        res.on('data', (d) => {
            process.stdout.write(d);
        });
    }).on('error', (e) => {
        console.error(e);
    });
}
setInterval(updateExternalIP, 600000);
updateExternalIP();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3d1bGZlcnQvcHJpdmF0ZS9tb3Rpb24vc2VydmVyL3NyYy8iLCJzb3VyY2VzIjpbInNlcnZlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDBDQUEwQztBQUMxQyw4Q0FBOEM7QUFDOUMsbUNBQW1DO0FBQ25DLDJCQUF1RDtBQUN2RCwrQkFBK0I7QUFDL0IsaUNBQTBCO0FBQzFCLDJDQUEyQztBQUMzQyxxQ0FBcUM7QUFDckMsbUVBQWdEO0FBQ2hELCtCQUEwQjtBQUMxQixxQ0FBNEI7QUFDNUIscUNBQW9DO0FBQ3BDLHFDQUdrQjtBQUNsQixtQ0FBeUY7QUFFekYsTUFBTSxNQUFNLEdBQUcsT0FBTyxDQUFDLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQztBQUU3RCxtQ0FBbUM7QUFDbkMsRUFBRSxDQUFDLENBQUMsZUFBSyxDQUFDLFVBQVUsQ0FBQyxLQUFLLElBQUksQ0FBQyxDQUFDLENBQUM7SUFDL0IsT0FBTyxDQUFDLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0lBQ3hELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7QUFDbEIsQ0FBQztBQUVELGlDQUFpQztBQUNqQyxFQUFFLENBQUMsQ0FBQyxlQUFLLENBQUMsUUFBUSxDQUFDLEtBQUssSUFBSSxDQUFDLENBQUMsQ0FBQztJQUM3QixPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7SUFDdEQsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztBQUNsQixDQUFDO0FBRUQsRUFBRSxDQUFDLENBQUMsQ0FBQyxlQUFVLENBQUMsV0FBSSxDQUFDLGFBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxVQUFVLENBQUMsQ0FBQyxJQUFJLENBQUMsZUFBVSxDQUFDLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFD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