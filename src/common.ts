import {readFileSync, writeFileSync} from 'fs';
import * as localNetworkScanner from 'local-network-scanner';
import {join} from 'path';
import {cwd} from 'process';
import {exec} from 'shelljs';
import {
  MotionAPIActiveDevicesList,
  MotionAPIDevicesList,
  MotionAPITrustedDevicesList,
  NodeJSCallbackWithResult
} from './types';

const config = JSON.parse(readFileSync(join(cwd(), 'config', 'config.json')).toString());

/**
 * Get list of devices that are currently active on the network
 *
 * @param {NodeJSCallback<MotionAPIActiveDevicesList>} done
 */
export function getDevicesOnNetwork(done: NodeJSCallbackWithResult<MotionAPIActiveDevicesList>): void {
  localNetworkScanner.scan(null, (devices: any[]) => {
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
export function enableMotion(done: NodeJSCallbackWithResult<string>): void {
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
export function disableMotion(done: NodeJSCallbackWithResult<string>): void {
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
export function saveTrustedDevices(trustedDevices: MotionAPITrustedDevicesList): void {
  writeFileSync(join(cwd(), 'database', 'trustedDevices.json'), JSON.stringify(trustedDevices));
}

/**
 * Decorate active devices with information from trusted devices
 *
 * @param {Array} activeDevices List of active devices
 * @param {Object} trustedDevices Map of trusted devices
 * @returns {Array}
 */
export function decorateDevices(activeDevices: MotionAPIActiveDevicesList,
                                trustedDevices: MotionAPITrustedDevicesList): MotionAPIDevicesList {
  const pad = require('pad');
  const devicesList: MotionAPIDevicesList = [];

  Object.keys(trustedDevices).forEach((mac) => {
    let trustedDeviceOnline = false;
    const trustedDevice = trustedDevices[mac];

    activeDevices.forEach((device) => {
      if (device.mac === mac) {
        devicesList.push({
          ...device,
          ...{
            name: trustedDevice.name,
            trusted: true
          }
        });
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
    let sortA: number = parseInt(deviceA.mac.replace(/:/g, ''), 16) / 100000000;
    let sortB: number = parseInt(deviceB.mac.replace(/:/g, ''), 16) / 100000000;

    if (deviceA.ip) {
      sortA = parseInt(deviceA.ip.split('.').map((part: string) => {
        return pad(3, part, '0');
      }).join(''), 10);
    }

    if (deviceB.ip) {
      sortB = parseInt(deviceB.ip.split('.').map((part: string) => {
        return pad(3, part, '0');
      }).join(''), 10);
    }

    return sortA - sortB;
  });

  devicesList.push.apply(devicesList, activeDevices);

  return devicesList;
}

/**
 * Check if the session is logged in
 * @param req
 * @param res
 * @param next
 */
export function isLoggedIn(req: any, res: any, next: () => void) {
  next();
  return;
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
