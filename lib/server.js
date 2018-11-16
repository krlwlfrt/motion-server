"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const expressSession = require("express-session");
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
const config = JSON.parse(fs_1.readFileSync(path_1.join(process_1.cwd(), 'config', 'config.json')).toString());
// check if `arp-scan` is installed
if (shelljs_1.which('arp-scan') === null) {
    throw new Error('Please install `arp-scan` to continue!');
}
// check if `motion` is installed
if (shelljs_1.which('motion') === null) {
    throw new Error('Please install `motion` to continue!');
}
if (!fs_1.existsSync(path_1.join(process_1.cwd(), 'config', 'cert.pem')) || !fs_1.existsSync(path_1.join(process_1.cwd(), 'config', 'key.pem'))) {
    throw new Error('Please supply an SSL certiticate!\n'
        + 'You can automatically generate one with the following command!\n'
        + 'openssl req -x509 -newkey rsa:4096 -keyout ' + path_1.join(process_1.cwd(), 'config', 'key.pem') + '' +
        '-out ' + path_1.join(process_1.cwd(), 'config', 'cert.pem') + ' -days 3650 -nodes');
}
if (!fs_1.existsSync(path_1.join(process_1.cwd(), 'config', 'config.json'))) {
    throw new Error('Please supply a config file!');
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
        throw err;
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
    settings = JSON.parse(fs_1.readFileSync(path_1.join(process_1.cwd(), 'database', 'motionSettings.json')).toString());
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
    trustedDevices = JSON.parse(fs_1.readFileSync(path_1.join(process_1.cwd(), 'database', 'trustedDevices.json')).toString());
}
/**
 * Scan network for trusted devices
 */
function scan() {
    common_1.getDevicesOnNetwork((err, activeDevices) => {
        if (err) {
            throw err;
        }
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
                        throw disableErr;
                    }
                    /* tslint:disable:no-console */
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
app.use(expressSession({
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
passport.use(new passport_google_oauth2_1.Strategy(config.google, (_accessToken, _refreshToken, profile, done) => {
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
app.get('/api/mode', common_1.isLoggedIn, (_request, result) => {
    result.send({ status: true, data: mode });
});
// define route to get the status
app.get('/api/status', common_1.isLoggedIn, (_request, result) => {
    shelljs_1.exec('ps cax | grep motion', { silent: true }, (code, stdOut, stdErr) => {
        if (stdErr) {
            throw new Error(stdErr);
        }
        if (code === 0 && stdOut.indexOf('motion') >= 0) {
            result.send({ status: true });
            return;
        }
        result.send({ status: false });
    });
});
// define route to get the settings
app.get('/api/settings', common_1.isLoggedIn, (_request, result) => {
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
app.get('/api/devices', common_1.isLoggedIn, (_request, result) => {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQTBDO0FBQzFDLDhDQUE4QztBQUM5QyxtQ0FBbUM7QUFDbkMsa0RBQWtEO0FBQ2xELDJCQUF1RDtBQUN2RCwrQkFBK0I7QUFDL0IsaUNBQTBCO0FBQzFCLDJDQUEyQztBQUMzQyxxQ0FBcUM7QUFDckMsbUVBQWdEO0FBQ2hELCtCQUEwQjtBQUMxQixxQ0FBNEI7QUFDNUIscUNBQW9DO0FBQ3BDLHFDQVNrQjtBQUNsQixtQ0FPaUI7QUFFakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBWSxDQUFDLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRXpGLG1DQUFtQztBQUNuQyxJQUFJLGVBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0NBQzNEO0FBRUQsaUNBQWlDO0FBQ2pDLElBQUksZUFBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7Q0FDekQ7QUFFRCxJQUFJLENBQUMsZUFBVSxDQUFDLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQVUsQ0FBQyxXQUFJLENBQUMsYUFBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUU7SUFDbkcsTUFBTSxJQUFJLEtBQUssQ0FDYixxQ0FBcUM7VUFDbkMsa0VBQWtFO1VBQ2xFLDZDQUE2QyxHQUFHLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLEdB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