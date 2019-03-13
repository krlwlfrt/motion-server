import {join} from 'path';
import {cwd} from 'process';
import {MotionSettings} from './types.settings';

/**
 * List of possible modes
 *
 * @type {string[]}
 */
export const MOTION_MODES = [
  'on',
  'auto',
  'off',
];

/* tslint:disable:max-line-length */
export const SETTINGS_META_DATA: { [s: string]: any } = {
  _missesConsideredOffline: {
    description: 'Nach wie vielen Scans, ohne dass ein vertrauenswürdiges Gerät gefunden wurde, soll die Kamera eingeschaltet werden?',
    title: '"Erfolglose" Scans',
    values: [2, 3, 4, 5, 7, 10],
  },
  _scanTimeout: {
    description: 'In welchem Intervall (in Millisekunden) soll das Netzwerk nach vertrauenswürdigen Geräten durchsucht werden?',
    title: 'Scan-Intervall',
    values: [10000, 20000, 30000, 60000],
  },
  framerate: {
    description: 'Mit welcher Frequenz (FPS) soll die Kamera Bilder aufnehmen?',
    title: 'Bildfrequenz',
    values: [2, 5, 10, 15],
  },
  rotate: {
    description: 'Um wieviel Grad soll das Bild im Uhrzeigersinn gedreht werden?',
    title: 'Rotation',
    values: [0, 90, 180, 270],
  },
  threshold: {
    description: 'Wie viele Pixel müssen sich zwischen 2 Bildern unterscheiden, um eine Bewegung zu erkennen?',
    title: 'Schwellwert',
  },
};
/* tslint:enable */

/**
 * NodeJS callback
 */
export type NodeJSCallback = ((err: Error | null) => void);
export type NodeJSCallbackWithResult<T> = ((err: Error | null, result: T) => void);

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

export function isMotionAPITrustedDevice(device: any): device is MotionAPITrustedDevice {
  return typeof device.name === 'string' && typeof device.trusted === 'boolean';
}

export function isMotionAPIAbstractDevice(device: any): device is MotionAPIActiveDevice {
  return typeof device.ip === 'string';
}

export type MotionAPIDevice = MotionAPIActiveDevice | MotionAPITrustedDevice;

/**
 * List of active devices
 */
export type MotionAPIActiveDevicesList = MotionAPIActiveDevice[];

/* tslint:disable:interface-over-type-literal */
export type MotionAPITrustedDevicesList = { [key: string]: MotionAPITrustedDevice };

export type MotionAPIDevicesList = MotionAPIDevice[];

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
export class MotionSettingsSensibleDefaults extends MotionSettings {
  /* tslint:disable:variable-name */
  /* tslint:disable:member-ordering */
  daemon = 'on';
  process_id_file = join(cwd(), 'database', 'motion.pid');
  logfile = join(cwd(), 'database', 'motion.log');
  videodevice = '/dev/video0';
  rotate = 0;
  width = 1280;
  height = 720;
  framerate = 10;
  threshold = 1500;
  pre_capture = 5;
  post_capture = 5;
  output_pictures = 'on';
  quality = 100;
  picture_type = 'jpeg';
  ffmpeg_output_movies = 'off';
  snapshot_interval = 5;
  snapshot_filename = 'snap';
  locate_motion_mode = 'on';
  locate_motion_style = 'redbox';
  target_dir = join(cwd(), 'database', 'images');
  stream_port = 0;
  stream_quality = 100;
  stream_localhost = 'on';
  webcontrol_port = 0;
  webcontrol_localhost = 'on';
  _scanTimeout = 30000;
  _missesConsideredOffline = 10;
  // timelapse_interval = 0;
  // timelapse_mode = 'daily';
  // timelapse_fps = 30;
  // timelapse_codec = 'mpeg4';
  on_event_start = '/usr/bin/node ' + join(cwd(), 'lib', 'event.js');
  picture_filename = '%Y%m%d-%H%M%S-%q';
  text_right: string = '%Y-%m-%d %T-%q';
  minimum_motion_frames = 3;
}
