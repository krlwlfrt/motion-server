"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = require("path");
const process_1 = require("process");
const types_settings_1 = require("./types.settings");
/**
 * List of possible modes
 *
 * @type {string[]}
 */
exports.MOTION_MODES = [
    'on',
    'auto',
    'off'
];
/* tslint:disable:max-line-length */
exports.SETTINGS_META_DATA = {
    _missesConsideredOffline: {
        description: 'Nach wie vielen Scans, ohne dass ein vertrauenswürdiges Gerät gefunden wurde, soll die Kamera eingeschaltet werden?',
        title: '"Erfolglose" Scans',
        values: [2, 3, 4, 5, 7, 10]
    },
    _scanTimeout: {
        description: 'In welchem Intervall (in Millisekunden) soll das Netzwerk nach vertrauenswürdigen Geräten durchsucht werden?',
        title: 'Scan-Intervall',
        values: [10000, 20000, 30000, 60000]
    },
    framerate: {
        description: 'Mit welcher Frequenz (FPS) soll die Kamera Bilder aufnehmen?',
        title: 'Bildfrequenz',
        values: [2, 5, 10, 15]
    },
    rotate: {
        description: 'Um wieviel Grad soll das Bild im Uhrzeigersinn gedreht werden?',
        title: 'Rotation',
        values: [0, 90, 180, 270]
    },
    threshold: {
        description: 'Wie viele Pixel müssen sich zwischen 2 Bildern unterscheiden, um eine Bewegung zu erkennen?',
        title: 'Schwellwert'
    }
};
/**
 * Sensible defaults for motion settings
 *
 * ```
 * lsusb
 * lsusb -s BUS:DEVICE -v | egrep "Width|Height"
 * ```
 */
class MotionSettingsSensibleDefaults extends types_settings_1.MotionSettings {
    constructor() {
        super(...arguments);
        /* tslint:disable:variable-name */
        this.daemon = 'on';
        this.process_id_file = path_1.join(process_1.cwd(), 'database', 'motion.pid');
        this.logfile = path_1.join(process_1.cwd(), 'database', 'motion.log');
        this.videodevice = '/dev/video0';
        this.rotate = 0;
        this.width = 1280;
        this.height = 720;
        this.framerate = 10;
        this.threshold = 1500;
        this.pre_capture = 5;
        this.post_capture = 5;
        this.output_pictures = 'on';
        this.quality = 100;
        this.picture_type = 'jpeg';
        this.ffmpeg_output_movies = 'off';
        this.snapshot_interval = 5;
        this.snapshot_filename = 'snap';
        this.locate_motion_mode = 'on';
        this.locate_motion_style = 'redbox';
        this.target_dir = path_1.join(process_1.cwd(), 'database', 'images');
        this.stream_port = 0;
        this.stream_quality = 100;
        this.stream_localhost = 'on';
        this.webcontrol_port = 0;
        this.webcontrol_localhost = 'on';
        this._scanTimeout = 30000;
        this._missesConsideredOffline = 10;
        // timelapse_interval = 0;
        // timelapse_mode = 'daily';
        // timelapse_fps = 30;
        // timelapse_codec = 'mpeg4';
        this.on_event_start = '/usr/bin/node ' + path_1.join(process_1.cwd(), 'lib', 'event.js');
        this.picture_filename = '%Y%m%d-%H%M%S-%q';
        this.text_right = '%Y-%m-%d %T-%q';
        this.minimum_motion_frames = 3;
    }
}
exports.MotionSettingsSensibleDefaults = MotionSettingsSensibleDefaults;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd3VsZmVydC9wcml2YXRlL21vdGlvbi9zZXJ2ZXIvc3JjLyIsInNvdXJjZXMiOlsidHlwZXMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSwrQkFBMEI7QUFDMUIscUNBQTRCO0FBQzVCLHFEQUFnRDtBQUVoRDs7OztHQUlHO0FBQ1UsUUFBQSxZQUFZLEdBQUc7SUFDMUIsSUFBSTtJQUNKLE1BQU07SUFDTixLQUFLO0NBQ04sQ0FBQztBQUVGLG9DQUFvQztBQUN2QixRQUFBLGtCQUFrQixHQUFHO0lBQ2hDLHdCQUF3QixFQUFFO1FBQ3hCLFdBQVcsRUFBRSxxSEFBcUg7UUFDbEksS0FBSyxFQUFFLG9CQUFvQjtRQUMzQixNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztLQUM1QjtJQUNELFlBQVksRUFBRTtRQUNaLFdBQVcsRUFBRSw4R0FBOEc7UUFDM0gsS0FBSyxFQUFFLGdCQUFnQjtRQUN2QixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDckM7SUFDRCxTQUFTLEVBQUU7UUFDVCxXQUFXLEVBQUUsOERBQThEO1FBQzNFLEtBQUssRUFBRSxjQUFjO1FBQ3JCLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztLQUN2QjtJQUNELE1BQU0sRUFBRTtRQUNOLFdBQVcsRUFBRSxnRUFBZ0U7UUFDN0UsS0FBSyxFQUFFLFVBQVU7UUFDakIsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0tBQzFCO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsV0FBVyxFQUFFLDZGQUE2RjtRQUMxRyxLQUFLLEVBQUUsYUFBYTtLQUNyQjtDQUNGLENBQUM7QUFpQ0Y7Ozs7Ozs7R0FPRztBQUNILG9DQUE0QyxTQUFRLCtCQUFjO0lBQWxFOztRQUNFLGtDQUFrQztRQUNsQyxXQUFNLEdBQUcsSUFBSSxDQUFDO1FBQ2Qsb0JBQWUsR0FBRyxXQUFJLENBQUMsYUFBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ3hELFlBQU8sR0FBRyxXQUFJLENBQUMsYUFBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLFlBQVksQ0FBQyxDQUFDO1FBQ2hELGdCQUFXLEdBQUcsYUFBYSxDQUFDO1FBQzVCLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFDWCxVQUFLLEdBQUcsSUFBSSxDQUFDO1FBQ2IsV0FBTSxHQUFHLEdBQUcsQ0FBQztRQUNiLGNBQVMsR0FBRyxFQUFFLENBQUM7UUFDZixjQUFTLEdBQUcsSUFBSSxDQUFDO1FBQ2pCLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLGlCQUFZLEdBQUcsQ0FBQyxDQUFDO1FBQ2pCLG9CQUFlLEdBQUcsSUFBSSxDQUFDO1FBQ3ZCLFlBQU8sR0FBRyxHQUFHLENBQUM7UUFDZCxpQkFBWSxHQUFHLE1BQU0sQ0FBQztRQUN0Qix5QkFBb0IsR0FBRyxLQUFLLENBQUM7UUFDN0Isc0JBQWlCLEdBQUcsQ0FBQyxDQUFDO1FBQ3RCLHNCQUFpQixHQUFHLE1BQU0sQ0FBQztRQUMzQix1QkFBa0IsR0FBRyxJQUFJLENBQUM7UUFDMUIsd0JBQW1CLEdBQUcsUUFBUSxDQUFDO1FBQy9CLGVBQVUsR0FBRyxXQUFJLENBQUMsYUFBRyxFQUFFLEVBQUUsVUFBVSxFQUFFLFFBQVEsQ0FBQyxDQUFDO1FBQy9DLGdCQUFXLEdBQUcsQ0FBQyxDQUFDO1FBQ2hCLG1CQUFjLEdBQUcsR0FBRyxDQUFDO1FBQ3JCLHFCQUFnQixHQUFHLElBQUksQ0FBQztRQUN4QixvQkFBZSxHQUFHLENBQUMsQ0FBQztRQUNwQix5QkFBb0IsR0FBRyxJQUFJLENBQUM7UUFDNUIsaUJBQVksR0FBRyxLQUFLLENBQUM7UUFDckIsNkJBQXdCLEdBQUcsRUFBRSxDQUFDO1FBQzlCLDBCQUEwQjtRQUMxQiw0QkFBNEI7UUFDNUIsc0JBQXNCO1FBQ3RCLDZCQUE2QjtRQUM3QixtQkFBYyxHQUFHLGdCQUFnQixHQUFHLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbkUscUJBQWdCLEdBQUcsa0JBQWtCLENBQUM7UUFDdEMsZUFBVSxHQUFXLGdCQUFnQixDQUFDO1FBQ3RDLDBCQUFxQixHQUFHLENBQUMsQ0FBQztJQUM1QixDQUFDO0NBQUE7QUFyQ0Qsd0VBcUNDIn0=