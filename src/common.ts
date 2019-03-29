import {createHash} from 'crypto';
import {existsSync, readdir, readFile, readFileSync, writeFile} from 'fs';
import * as G from 'glob';
import {resolve} from 'path';
import {exec} from 'shelljs';
import {promisify} from 'util';
import {SensibleSettings} from './config';
import {NetworkDevice} from './types';
import {Settings} from './types.settings';

export const globPromisified = promisify(G);
export const readdirPromisified = promisify(readdir);
export const readFilePromisified = promisify(readFile);
export const writeFilePromisified = promisify(writeFile);

export const configPath = resolve(__dirname, '..', 'config', 'config.json');
export const eventsPath = resolve(__dirname, '..', 'database', 'events');
export const motionConfigPath = resolve(__dirname, '..', 'config', 'motion.conf');
export const settingsPath = resolve(__dirname, '..', 'config', 'settings.json');
export const trustedDevicesPath = resolve(__dirname, '..', 'config', 'trustedDevices.json');

/**
 * Sleep/wait for a specified duration
 *
 * @param duration Duration to sleep/wait in milliseconds
 */
export async function sleep(duration: number): Promise<void> {
  return new Promise((resolvePromise) => {
    setTimeout(() => {
      resolvePromise();
    }, duration);
  });
}

/**
 * Get list of devices that are currently active on the network
 */
export async function getDevicesOnNetwork(): Promise<NetworkDevice[]> {
  return new Promise((resolvePromise, rejectPromise) => {
    exec('arp-scan -l -x', {silent: true}, (code, stdOut, stdErr) => {
      if (code === 0) {
        const hosts = stdOut.split('\n');
        const networkDevices: NetworkDevice[] = [];

        console.log(hosts);

        hosts.forEach((host) => {
          const fields = host.split('\t');

          if (fields.length < 3) {
            return;
          }

          const networkDevice: NetworkDevice = {
            ip: fields[0],
            mac: fields[1],
            vendor: fields[2],
          };

          console.log(networkDevice);

          networkDevices.push(networkDevice);
        });

        console.log(networkDevices);

        return resolvePromise(networkDevices);
      }

      console.error(code, stdErr);
      rejectPromise();
    });
  });
}

/**
 * Compile and save a list of settings as motion.conf
 */
export async function saveMotionConfig(settings: Settings): Promise<void> {
  let motionConfig = '';

  // concatenate settings with new lines
  Object.keys(settings).forEach((key) => {
    if (key.indexOf('_') === 0) {
      return;
    }

    motionConfig += key + ' ' + settings[key] + '\n';
  });

  return writeFilePromisified(motionConfigPath, motionConfig);
}

/**
 * Save settings
 */
export async function saveSettings(settings: Settings): Promise<void> {
  return writeFilePromisified(settingsPath, JSON.stringify(settings));
}

/**
 * Load settings
 */
export function loadSettings(): Settings {
  // check if we have saved settings
  if (existsSync(settingsPath)) {
    // load saved settings
    return JSON.parse(readFileSync(settingsPath).toString());
  }

  // create initial settings and save them
  return new SensibleSettings();
}

/**
 * Enable motion
 */
export async function enableMotion(): Promise<string> {
  return new Promise((resolvePromise, rejectPromise) => {
    exec(`motion -b -c ${motionConfigPath}`, {silent: true}, (code, stdOut, stdErr) => {
      console.log(code, stdOut, stdErr);

      if (code === 0) {
        return resolvePromise(stdOut);
      }

      rejectPromise(stdErr);
    });
  });
}

/**
 * Disable motion
 */
export async function disableMotion(): Promise<string> {
  return new Promise((resolvePromise, rejectPromise) => {
    exec('killall motion', {silent: false}, (code, stdOut, stdErr) => {
      if (code === 0) {
        return resolvePromise(stdOut);
      }

      rejectPromise(stdErr);
    });
  });
}

/**
 * Save trusted devices
 */
export function saveTrustedDevices(trustedDevices: NetworkDevice[]): Promise<void> {
  return writeFilePromisified(trustedDevicesPath, JSON.stringify(trustedDevices));
}

/**
 * Save trusted devices
 */
export function loadTrustedDevices(): NetworkDevice[] {
  if (!existsSync(trustedDevicesPath)) {
    return [];
  }

  return JSON.parse(readFileSync(trustedDevicesPath).toString());
}

/**
 * Decorate active devices with information from trusted devices
 *
 * @param activeDevices List of active devices
 * @param trustedDevices Map of trusted devices
 */
export function decorateDevices(activeDevices: NetworkDevice[],
                                trustedDevices: NetworkDevice[]): NetworkDevice[] {
  const pad = require('pad');
  const devicesList: NetworkDevice[] = [];

  trustedDevices.forEach((trustedDevice) => {
    let trustedDeviceOnline = false;

    activeDevices.forEach((activeDevice) => {
      if (activeDevice.mac === trustedDevice.mac) {
        devicesList.push({
          ...activeDevice,
          ...{
            name: trustedDevice.name,
            trusted: true,
          },
        });
        trustedDeviceOnline = true;
      }
    });

    if (!trustedDeviceOnline) {
      devicesList.push({
        mac: trustedDevice.mac,
        name: trustedDevice.name,
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
 * Get main config
 */
export function loadConfig(): any {
  return JSON.parse(readFileSync(configPath).toString());
}

/**
 * Calculate a hash of something
 * @param content Something to calculate hash for
 */
export function hash(content: string): string {
  const hashBuffer = createHash('sha1');
  hashBuffer.update(content);
  return hashBuffer.digest('hex').toString();
}
