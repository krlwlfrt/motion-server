"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const localNetworkScanner = require("local-network-scanner");
const path_1 = require("path");
const process_1 = require("process");
const shelljs_1 = require("shelljs");
const config = JSON.parse(fs_1.readFileSync(path_1.join(process_1.cwd(), 'config', 'config.json')).toString());
/**
 * Get list of devices that are currently active on the network
 *
 * @param {NodeJSCallback<MotionAPIActiveDevicesList>} done
 */
function getDevicesOnNetwork(done) {
    localNetworkScanner.scan(null, (devices) => {
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
    const devicesList = [];
    Object.keys(trustedDevices).forEach((mac) => {
        let trustedDeviceOnline = false;
        const trustedDevice = trustedDevices[mac];
        activeDevices.forEach((device) => {
            if (device.mac === mac) {
                devicesList.push(Object.assign({}, device, {
                    name: trustedDevice.name,
                    trusted: true
                }));
                trustedDeviceOnline = true;
            }
        });
        if (!trustedDeviceOnline) {
            devicesList.push({
                ip: '',
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
    return devicesList;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQStDO0FBQy9DLDZEQUE2RDtBQUM3RCwrQkFBMEI7QUFDMUIscUNBQTRCO0FBQzVCLHFDQUE2QjtBQVE3QixNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLGlCQUFZLENBQUMsV0FBSSxDQUFDLGFBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxhQUFhLENBQUMsQ0FBQyxDQUFDLFFBQVEsRUFBRSxDQUFDLENBQUM7QUFFekY7Ozs7R0FJRztBQUNILFNBQWdCLG1CQUFtQixDQUFDLElBQTBEO0lBQzVGLG1CQUFtQixDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxPQUFjLEVBQUUsRUFBRTtRQUNoRCxJQUFJLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3RCLENBQUMsQ0FBQyxDQUFDO0FBQ0wsQ0FBQztBQUpELGtEQUlDO0FBRUQ7Ozs7R0FJRztBQUNILFNBQWdCLGNBQWMsQ0FBQyxRQUFhO0lBQzFDLElBQUksVUFBVSxHQUFHLEVBQUUsQ0FBQztJQUNwQixNQUFNLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEdBQUcsRUFBRSxFQUFFO1FBQ3BDLElBQUksR0FBRyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDMUIsT0FBTztTQUNSO1FBRUQsVUFBVSxJQUFJLEdBQUcsR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksQ0FBQztJQUNqRCxDQUFDLENBQUMsQ0FBQztJQUNILGtCQUFhLENBQUMsV0FBSSxDQUFDLGFBQUcsRUFBRSxFQUFFLFVBQVUsRUFBRSxhQUFhLENBQUMsRUFBRSxVQUFVLENBQUMsQ0FBQztBQUNwRSxDQUFDO0FBVkQsd0NBVUM7QUFFRDs7OztHQUlHO0FB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