import { MotionAPIAbstractDevice, MotionAPIActiveDevicesList, MotionAPIDevicesList, MotionAPITrustedDevicesList, NodeJSCallbackWithResult } from './types';
/**
 * Get list of devices that are currently active on the network
 *
 * @param {NodeJSCallback<MotionAPIActiveDevicesList>} done
 */
export declare function getDevicesOnNetwork(done: NodeJSCallbackWithResult<MotionAPIActiveDevicesList>): void;
/**
 * Save motion.conf
 *
 * @param {Object} settings
 */
export declare function saveMotionConf(settings: any): void;
/**
 * Save settings
 *
 * @param {Object} settings
 */
export declare function saveSettings(settings: any): void;
/**
 * Enable motion
 *
 * @param {NodeJSCallback<string>} done
 */
export declare function enableMotion(done: NodeJSCallbackWithResult<string>): void;
/**
 * Disable motion
 *
 * @param {NodeJSCallback<string>} done
 */
export declare function disableMotion(done: NodeJSCallbackWithResult<string>): void;
/**
 * Save trusted devices
 *
 * @param {Object} trustedDevices List of trusted devices
 */
export declare function saveTrustedDevices(trustedDevices: MotionAPITrustedDevicesList): void;
/**
 * Decorate active devices with information from trusted devices
 *
 * @param {Array} activeDevices List of active devices
 * @param {Object} trustedDevices Map of trusted devices
 * @returns {Array}
 */
export declare function decorateDevices(activeDevices: MotionAPIAbstractDevice[], trustedDevices: MotionAPITrustedDevicesList): MotionAPIDevicesList;
/**
 * Check if the session is logged in
 * @param req
 * @param res
 * @param next
 */
export declare function isLoggedIn(req: any, res: any, next: () => void): void;
