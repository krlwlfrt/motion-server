import { MotionSettings } from './types.settings';
/**
 * List of possible modes
 *
 * @type {string[]}
 */
export declare const MOTION_MODES: string[];
export declare const SETTINGS_META_DATA: {
    [s: string]: any;
};
/**
 * NodeJS callback
 */
export declare type NodeJSCallback = ((err: Error | null) => void);
export declare type NodeJSCallbackWithResult<T> = ((err: Error | null, result: T) => void);
/**
 * Device
 */
export interface MotionAPIAbstractDevice {
    mac: string;
}
export interface MotionAPIActiveDevice extends MotionAPIAbstractDevice {
    ip: string;
}
export interface MotionAPITrustedDevice extends MotionAPIAbstractDevice {
    name: string;
    trusted: boolean;
}
export declare function isMotionAPITrustedDevice(device: any): device is MotionAPITrustedDevice;
export declare function isMotionAPIAbstractDevice(device: any): device is MotionAPIActiveDevice;
export declare type MotionAPIDevice = MotionAPIActiveDevice | MotionAPITrustedDevice;
/**
 * List of active devices
 */
export declare type MotionAPIActiveDevicesList = MotionAPIActiveDevice[];
export declare type MotionAPITrustedDevicesList = {
    [key: string]: MotionAPITrustedDevice;
};
export declare type MotionAPIDevicesList = MotionAPIDevice[];
/**
 * Response from Motion API
 */
export interface MotionAPIResponse<T> {
    /**
     * Data of the response
     */
    data?: T;
    /**
     * Message that describes the response
     */
    message?: string;
    /**
     * Status of the response
     */
    status: boolean;
}
export interface MotionAPITrustRequest {
    mac: string;
}
/**
 * Sensible defaults for motion settings
 *
 * ```
 * lsusb
 * lsusb -s BUS:DEVICE -v | egrep "Width|Height"
 * ```
 */
export declare class MotionSettingsSensibleDefaults extends MotionSettings {
    daemon: string;
    process_id_file: string;
    logfile: string;
    videodevice: string;
    rotate: number;
    width: number;
    height: number;
    framerate: number;
    threshold: number;
    pre_capture: number;
    post_capture: number;
    output_pictures: string;
    quality: number;
    picture_type: string;
    ffmpeg_output_movies: string;
    snapshot_interval: number;
    snapshot_filename: string;
    locate_motion_mode: string;
    locate_motion_style: string;
    target_dir: string;
    stream_port: number;
    stream_quality: number;
    stream_localhost: string;
    webcontrol_port: number;
    webcontrol_localhost: string;
    _scanTimeout: number;
    _missesConsideredOffline: number;
    on_event_start: string;
    picture_filename: string;
    text_right: string;
    minimum_motion_frames: number;
}
