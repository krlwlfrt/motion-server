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
            if (types_1.isMotionAPITrustedDevice(device)) {
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
    secret: config.google.clientSecret,
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
    successRedirect: '/app',
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
        'threshold',
    ].map((key) => {
        return {
            description: types_1.SETTINGS_META_DATA[key].description,
            key: key,
            title: types_1.SETTINGS_META_DATA[key].title,
            value: settings[key],
            values: types_1.SETTINGS_META_DATA[key].values,
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
    key: fs_1.readFileSync(path_1.join(process_1.cwd(), 'config', 'key.pem')),
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic2VydmVyLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsic2VydmVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMENBQTBDO0FBQzFDLDhDQUE4QztBQUM5QyxtQ0FBbUM7QUFDbkMsa0RBQWtEO0FBQ2xELDJCQUF1RDtBQUN2RCwrQkFBK0I7QUFDL0IsaUNBQTBCO0FBQzFCLDJDQUEyQztBQUMzQyxxQ0FBcUM7QUFDckMsbUVBQWdEO0FBQ2hELCtCQUEwQjtBQUMxQixxQ0FBNEI7QUFDNUIscUNBQW9DO0FBQ3BDLHFDQVNrQjtBQUNsQixtQ0FRaUI7QUFFakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBWSxDQUFDLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRXpGLG1DQUFtQztBQUNuQyxJQUFJLGVBQUssQ0FBQyxVQUFVLENBQUMsS0FBSyxJQUFJLEVBQUU7SUFDOUIsTUFBTSxJQUFJLEtBQUssQ0FBQyx3Q0FBd0MsQ0FBQyxDQUFDO0NBQzNEO0FBRUQsaUNBQWlDO0FBQ2pDLElBQUksZUFBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLElBQUksRUFBRTtJQUM1QixNQUFNLElBQUksS0FBSyxDQUFDLHNDQUFzQyxDQUFDLENBQUM7Q0FDekQ7QUFFRCxJQUFJLENBQUMsZUFBVSxDQUFDLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsVUFBVSxDQUFDLENBQUMsSUFBSSxDQUFDLGVBQVUsQ0FBQyxXQUFJLENBQUMsYUFBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLFNBQVMsQ0FBQyxDQUFDLEVBQUU7SUFDbkcsTUFBTSxJQUFJLEtBQUssQ0FDYixxQ0FBcUM7VUFDbkMsa0VBQWtFO1VBQ2xFLDZDQUE2QyxHQUFHLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsU0FBUyxDQUFDLEdB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