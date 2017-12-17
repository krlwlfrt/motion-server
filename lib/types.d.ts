import { MotionSettings } from './types.settings';
/**
 * List of possible modes
 *
 * @type {string[]}
 */
export declare const MOTION_MODES: string[];
export declare const SETTINGS_META_DATA: {
    _missesConsideredOffline: {
        description: string;
        title: string;
        values: number[];
    };
    _scanTimeout: {
        description: string;
        title: string;
        values: number[];
    };
    framerate: {
        description: string;
        title: string;
        values: number[];
    };
    rotate: {
        description: string;
        title: string;
        values: number[];
    };
    threshold: {
        description: string;
        title: string;
    };
};
/**
 * NodeJS callback
 */
export declare type NodeJSCallback<T> = ((err: Error, result?: T) => void);
/**
 * List of active devices
 */
export declare type MotionAPIActiveDeviceList = Array<{
    ip: string;
    mac: string;
}>;
/**
 * Response from Motion API
 */
export interface MotionAPIResponse<T> {
    /**
     * Status of the response
     */
    status: boolean;
    /**
     * Data of the response
     */
    data?: T;
    /**
     * Message that describes the response
     */
    message?: string;
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
