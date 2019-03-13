"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const localNetworkScanner = require("local-network-scanner");
const path_1 = require("path");
const process_1 = require("process");
const shelljs_1 = require("shelljs");
const types_1 = require("./types");
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
                    trusted: true,
                }));
                trustedDeviceOnline = true;
            }
        });
        if (!trustedDeviceOnline) {
            devicesList.push({
                mac: trustedDevice.mac,
                name: trustedDevice.name,
                trusted: true,
            });
        }
    });
    activeDevices.sort((deviceA, deviceB) => {
        let sortA = parseInt(deviceA.mac.replace(/:/g, ''), 16) / 100000000;
        let sortB = parseInt(deviceB.mac.replace(/:/g, ''), 16) / 100000000;
        if (types_1.isMotionAPIAbstractDevice(deviceA) && deviceA.ip) {
            sortA = parseInt(deviceA.ip.split('.').map((part) => {
                return pad(3, part, '0');
            }).join(''), 10);
        }
        if (types_1.isMotionAPIAbstractDevice(deviceB) && deviceB.ip) {
            sortB = parseInt(deviceB.ip.split('.').map((part) => {
                return pad(3, part, '0');
            }).join(''), 10);
        }
        return sortA - sortB;
    });
    devicesList.push.apply(devicesList, activeDevices);
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY29tbW9uLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY29tbW9uLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsMkJBQStDO0FBQy9DLDZEQUE2RDtBQUM3RCwrQkFBMEI7QUFDMUIscUNBQTRCO0FBQzVCLHFDQUE2QjtBQUM3QixtQ0FPaUI7QUFFakIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBWSxDQUFDLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxRQUFRLEVBQUUsYUFBYSxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxDQUFDO0FBRXpGOzs7O0dBSUc7QUFDSCxTQUFnQixtQkFBbUIsQ0FBQyxJQUEwRDtJQUM1RixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUMsT0FBYyxFQUFFLEVBQUU7UUFDaEQsSUFBSSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQztJQUN0QixDQUFDLENBQUMsQ0FBQztBQUNMLENBQUM7QUFKRCxrREFJQztBQUVEOzs7O0dBSUc7QUFDSCxTQUFnQixjQUFjLENBQUMsUUFBYTtJQUMxQyxJQUFJLFVBQVUsR0FBRyxFQUFFLENBQUM7SUFDcEIsTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxHQUFHLEVBQUUsRUFBRTtRQUNwQyxJQUFJLEdBQUcsQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxFQUFFO1lBQzFCLE9BQU87U0FDUjtRQUVELFVBQVUsSUFBSSxHQUFHLEdBQUcsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUM7SUFDakQsQ0FBQyxDQUFDLENBQUM7SUFDSCxrQkFBYSxDQUFDLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsYUFBYSxDQUFDLEVBQUUsVUFBVSxDQUFDLENBQUM7QUFDcEUsQ0FBQztBQVZELHdDQVVDO0FB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