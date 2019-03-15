import {resolve} from 'path';
import {Settings} from './types.settings';

/**
 * Meta data for user changeable settings
 */
export const SETTINGS_META_DATA: { [s: string]: { description: string; title: string; values?: any[] } } = {
  _eventDelay: {
    /* tslint:disable-next-line:max-line-length */
    description: 'Anzahl an Sekunden, die nach einer erkannten Bewegung gewartet werden soll, bevor die Bilder verschickt werden.',
    title: 'Wartezeit',
    values: [2, 5, 10, 20, 50],
  },
  _missesConsideredOffline: {
    /* tslint:disable-next-line:max-line-length */
    description: 'Nach wie vielen Scans, ohne dass ein vertrauenswürdiges Gerät gefunden wurde, soll die Kamera eingeschaltet werden?',
    title: '"Erfolglose" Scans',
    values: [2, 3, 4, 5, 6, 7, 8, 9, 10],
  },
  _numberOfImages: {
    description: 'Anzahl an Bildern, die verschickt werden sollen, wenn eine Bewegung erkannt wird.',
    title: 'Anzahl an Bildern',
    values: [2, 5, 10, 20, 50, 100],
  },
  _scanTimeout: {
    /* tslint:disable-next-line:max-line-length */
    description: 'In welchem Intervall (in Sekunden) soll das Netzwerk nach vertrauenswürdigen Geräten durchsucht werden?',
    title: 'Scan-Intervall',
    values: [10, 20, 30, 60],
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

/**
 * Sensible defaults for motion settings
 *
 * ```
 * lsusb
 * lsusb -s BUS:DEVICE -v | egrep "Width|Height"
 * ```
 */
export class SensibleSettings extends Settings {
  /* tslint:disable:variable-name */
  /* tslint:disable:member-ordering */
  daemon = 'on';
  pid_file = resolve(__dirname, '..', 'database', 'motion.pid');
  log_file = resolve(__dirname, '..', 'database', 'motion.log');
  videodevice = '/dev/video0';
  rotate = 0;
  width = 1280;
  height = 720;
  framerate = 2;
  threshold = 1500;
  pre_capture = 5;
  post_capture = 5;
  picture_output = 'on';
  picture_quality = 90;
  picture_type = 'jpeg';
  movie_output = 'off';
  snapshot_interval = 5;
  snapshot_filename = 'snap';
  locate_motion_mode = 'on';
  locate_motion_style = 'redbox';
  target_dir = resolve(__dirname, '..', 'database', 'images');
  stream_port = 0;
  stream_quality = 90;
  stream_localhost = 'on';
  webcontrol_port = 0;
  webcontrol_localhost = 'on';
  _eventDelay = 10;
  _missesConsideredOffline = 5;
  _numberOfImages = 20;
  _scanTimeout = 30;
  // timelapse_interval = 0;
  // timelapse_mode = 'daily';
  // timelapse_fps = 30;
  // timelapse_codec = 'mpeg4';
  on_event_start = 'systemctl start motion-event';
  picture_filename = '%Y%m%d-%H%M%S-%q';
  text_right = '%Y-%m-%d %T-%q';
  minimum_motion_frames = 3;
}
