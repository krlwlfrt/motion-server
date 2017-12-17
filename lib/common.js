"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const process_1 = require("process");
const shelljs_1 = require("shelljs");
const localNetworkScanner = require('local-network-scanner');
const config = require(path_1.join(process_1.cwd(), 'config', 'config.json'));
/**
 * Get list of devices that are currently active on the network
 *
 * @param {NodeJSCallback<MotionAPIActiveDeviceList>} done
 */
function getDevicesOnNetwork(done) {
    localNetworkScanner.scan((devices) => {
        done(null, devices);
    });
}
exports.getDevicesOnNetwork = getDevicesOnNetwork;
/**
 * Save motion.conf
 *
 * @param {Object} settings
 */
function saveMotionConf(settings) {
    let motionConf = '';
    Object.keys(settings).forEach((key) => {
        if (key.indexOf('_') === 0) {
            return;
        }
        motionConf += key + ' ' + settings[key] + '\n';
    });
    fs_1.writeFileSync(path_1.join(process_1.cwd(), 'database', 'motion.conf'), motionConf);
}
exports.saveMotionConf = saveMotionConf;
/**
 * Save settings
 *
 * @param {Object} settings
 */
function saveSettings(settings) {
    fs_1.writeFileSync(path_1.join(process_1.cwd(), 'database', 'motionSettings.json'), JSON.stringify(settings));
}
exports.saveSettings = saveSettings;
/**
 * Enable motion
 *
 * @param {NodeJSCallback<string>} done
 */
function enableMotion(done) {
    shelljs_1.exec('motion -b -c ' + path_1.join(process_1.cwd(), 'database', 'motion.conf'), { silent: true }, (code, stdOut, stdErr) => {
        if (code === 0) {
            done(null, stdOut);
            return;
        }
        done(new Error(stdErr), code.toString());
    });
}
exports.enableMotion = enableMotion;
/**
 * Disable motion
 *
 * @param {NodeJSCallback<string>} done
 */
function disableMotion(done) {
    shelljs_1.exec('killall motion', { silent: false }, (code, stdOut, stdErr) => {
        if (code === 0) {
            done(null, stdOut);
            return;
        }
        done(new Error(stdErr), code.toString());
    });
}
exports.disableMotion = disableMotion;
/**
 * Save trusted devices
 *
 * @param {Object} trustedDevices List of trusted devices
 */
function saveTrustedDevices(trustedDevices) {
    fs_1.writeFileSync(path_1.join(process_1.cwd(), 'database', 'trustedDevices.json'), JSON.stringify(trustedDevices));
}
exports.saveTrustedDevices = saveTrustedDevices;
/**
 * Decorate active devices with information from trusted devices
 *
 * @param {Array} activeDevices List of active devices
 * @param {Object} trustedDevices Map of trusted devices
 * @returns {Array}
 */
function decorateDevices(activeDevices, trustedDevices) {
    const pad = require('pad');
    Object.keys(trustedDevices).forEach((mac) => {
        let trustedDeviceOnline = false;
        const trustedDevice = trustedDevices[mac];
        activeDevices.forEach((device) => {
            if (device.mac === mac) {
                Object.assign(device, {
                    name: trustedDevice.name,
                    trusted: true
                });
                trustedDeviceOnline = true;
            }
        });
        if (!trustedDeviceOnline) {
            activeDevices.push({
                mac: trustedDevice.mac,
                name: trustedDevice.name,
                trusted: true
            });
        }
    });
    activeDevices.sort((deviceA, deviceB) => {
        let sortA = parseInt(deviceA.mac.replace(/:/g, ''), 16) / 100000000;
        let sortB = parseInt(deviceB.mac.replace(/:/g, ''), 16) / 100000000;
        if (deviceA.ip) {
            sortA = parseInt(deviceA.ip.split('.').map((part) => {
                return pad(3, part, '0');
            }).join(''), 10);
        }
        if (deviceB.ip) {
            sortB = parseInt(deviceB.ip.split('.').map((part) => {
                return pad(3, part, '0');
            }).join(''), 10);
        }
        return sortA - sortB;
    });
    return activeDevices;
}
exports.decorateDevices = decorateDevices;
/**
 * Check if the session is logged in
 * @param req
 * @param res
 * @param next
 */
function isLoggedIn(req, res, next) {
    if (req.user) {
        if (config.allowedEmails.indexOf(req.user.email) === -1) {
            res.sendStatus(403);
        }
        else {
            next();
        }
    }
    else {
        res.redirect('/auth/google');
    }
}
exports.isLoggedIn = isLoggedIn;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3d1bGZlcnQvcHJpdmF0ZS9tb3Rpb24vc2VydmVyL3NyYy8iLCJzb3VyY2VzIjpbImNvbW1vbi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLDJCQUFpQztBQUNqQywrQkFBMEI7QUFDMUIscUNBQTRCO0FBQzVCLHFDQUE2QjtBQUc3QixNQUFNLG1CQUFtQixHQUFHLE9BQU8sQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDO0FBRTdELE1BQU0sTUFBTSxHQUFHLE9BQU8sQ0FBQyxXQUFJLENBQUMsYUFBRyxFQUFFLEVBQUUsUUFBUSxFQUFFLGFBQWEsQ0FBQyxDQUFDLENBQUM7QUFFN0Q7Ozs7R0FJRztBQUNILDZCQUFvQyxJQUErQztJQUNqRixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLEVBQUUsRUFBRTtRQUNuQyxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUpELGtEQUlDO0FBRUQ7Ozs7R0FJRztBQUNILHdCQUErQixRQUFhO0lBQzFDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3BDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUMzQixNQUFNLENBQUM7UUFDVCxDQUFDO1FBRUQsVUFBVSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNILGtCQUFhLENBQUMsV0FBSSxDQUFDLGFBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNwRSxD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