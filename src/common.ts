import {writeFileSync} from 'fs';
import {join} from 'path';
import {cwd} from 'process';
import {exec} from 'shelljs';
import {MotionAPIActiveDeviceList, NodeJSCallback} from './types';

const localNetworkScanner = require('local-network-scanner');

const config = require(join(cwd(), 'config', 'config.json'));

/**
 * Get list of devices that are currently active on the network
 *
 * @param {NodeJSCallback<MotionAPIActiveDeviceList>} done
 */
export function getDevicesOnNetwork(done: NodeJSCallback<MotionAPIActiveDeviceList>): void {
  localNetworkScanner.scan((devices) => {
    done(null, devices);
  });
}

/**
 * Save motion.conf
 *
 * @param {Object} settings
 */
export function saveMotionConf(settings: any): void {
  let motionConf = '';
  Object.keys(settings).forEach((key) => {
    if (key.indexOf('_') === 0) {
      return;
    }

    motionConf += key + ' ' + settings[key] + '\n';
  });
  writeFileSync(join(cwd(), 'database', 'motion.conf'), motionConf);
}

/**
 * Save settings
 *
 * @param {Object} settings
 */
export function saveSettings(settings: any): void {
  writeFileSync(join(cwd(), 'database', 'motionSettings.json'), JSON.stringify(settings));
}

/**
 * Enable motion
 *
 * @param {NodeJSCallback<string>} done
 */
export function enableMotion(done: NodeJSCallback<string>): void {
  exec('motion -b -c ' + join(cwd(), 'database', 'motion.conf'), {silent: true}, (code, stdOut, stdErr) => {
    if (code === 0) {
      done(null, stdOut);
      return;
    }

    done(new Error(stdErr), code.toString());
  });
}

/**
 * Disable motion
 *
 * @param {NodeJSCallback<string>} done
 */
export function disableMotion(done: NodeJSCallback<string>): void {
  exec('killall motion', {silent: false}, (code, stdOut, stdErr) => {
    if (code === 0) {
      done(null, stdOut);
      return;
    }

    done(new Error(stdErr), code.toString());
  });
}

/**
 * Save trusted devices
 *
 * @param {Object} trustedDevices List of trusted devices
 */
export function saveTrustedDevices(trustedDevices): void {
  writeFileSync(join(cwd(), 'database', 'trustedDevices.json'), JSON.stringify(trustedDevices));
}

/**
 * Decorate active devices with information from trusted devices
 *
 * @param {Array} activeDevices List of active devices
 * @param {Object} trustedDevices Map of trusted devices
 * @returns {Array}
 */
export function decorateDevices(activeDevices, trustedDevices): any[] {
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
    let sortA: number = parseInt(deviceA.mac.replace(/:/g, ''), 16) / 100000000;
    let sortB: number = parseInt(deviceB.mac.replace(/:/g, ''), 16) / 100000000;

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

/**
 * Check if the session is logged in
 * @param req
 * @param res
 * @param next
 */
export function isLoggedIn(req, res, next) {
  if (req.user) {
    if (config.allowedEmails.indexOf(req.user.email) === -1) {
      res.sendStatus(403);
    } else {
      next();
    }
  } else {
    res.redirect('/auth/google');
  }
}
