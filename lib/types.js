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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuanMiLCJzb3VyY2VSb290IjoiLi9zcmMvIiwic291cmNlcyI6WyJ0eXBlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLCtCQUEwQjtBQUMxQixxQ0FBNEI7QUFDNUIscURBQWdEO0FBRWhEOzs7O0dBSUc7QUFDVSxRQUFBLFlBQVksR0FBRztJQUMxQixJQUFJO0lBQ0osTUFBTTtJQUNOLEtBQUs7Q0FDTixDQUFDO0FBRUYsb0NBQW9DO0FBQ3ZCLFFBQUEsa0JBQWtCLEdBQXlCO0lBQ3RELHdCQUF3QixFQUFFO1FBQ3hCLFdBQVcsRUFBRSxxSEFBcUg7UUFDbEksS0FBSyxFQUFFLG9CQUFvQjtRQUMzQixNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxFQUFFLEVBQUUsQ0FBQztLQUM1QjtJQUNELFlBQVksRUFBRTtRQUNaLFdBQVcsRUFBRSw4R0FBOEc7UUFDM0gsS0FBSyxFQUFFLGdCQUFnQjtRQUN2QixNQUFNLEVBQUUsQ0FBQyxLQUFLLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxLQUFLLENBQUM7S0FDckM7SUFDRCxTQUFTLEVBQUU7UUFDVCxXQUFXLEVBQUUsOERBQThEO1FBQzNFLEtBQUssRUFBRSxjQUFjO1FBQ3JCLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLEVBQUUsQ0FBQztLQUN2QjtJQUNELE1BQU0sRUFBRTtRQUNOLFdBQVcsRUFBRSxnRUFBZ0U7UUFDN0UsS0FBSyxFQUFFLFVBQVU7UUFDakIsTUFBTSxFQUFFLENBQUMsQ0FBQyxFQUFFLEVBQUUsRUFBRSxHQUFHLEVBQUUsR0FBRyxDQUFDO0tBQzFCO0lBQ0QsU0FBUyxFQUFFO1FBQ1QsV0FBVyxFQUFFLDZGQUE2RjtRQUMxRyxLQUFLLEVBQUUsYUFBYTtLQUNyQjtDQUNGLENBQUM7QUE4REY7Ozs7Ozs7R0FPRztBQUNILE1BQWEsOEJBQStCLFNBQVEsK0JBQWM7SUFBbEU7O1FBQ0Usa0NBQWtDO1FBQ2xDLFdBQU0sR0FBRyxJQUFJLENBQUM7UUFDZCxvQkFBZSxHQUFHLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDeEQsWUFBTyxHQUFHLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsWUFBWSxDQUFDLENBQUM7UUFDaEQsZ0JBQVcsR0FBRyxhQUFhLENBQUM7UUFDNUIsV0FBTSxHQUFHLENBQUMsQ0FBQztRQUNYLFVBQUssR0FBRyxJQUFJLENBQUM7UUFDYixXQUFNLEdBQUcsR0FBRyxDQUFDO1FBQ2IsY0FBUyxHQUFHLEVBQUUsQ0FBQztRQUNmLGNBQVMsR0FBRyxJQUFJLENBQUM7UUFDakIsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsaUJBQVksR0FBRyxDQUFDLENBQUM7UUFDakIsb0JBQWUsR0FBRyxJQUFJLENBQUM7UUFDdkIsWUFBTyxHQUFHLEdBQUcsQ0FBQztRQUNkLGlCQUFZLEdBQUcsTUFBTSxDQUFDO1FBQ3RCLHlCQUFvQixHQUFHLEtBQUssQ0FBQztRQUM3QixzQkFBaUIsR0FBRyxDQUFDLENBQUM7UUFDdEIsc0JBQWlCLEdBQUcsTUFBTSxDQUFDO1FBQzNCLHVCQUFrQixHQUFHLElBQUksQ0FBQztRQUMxQix3QkFBbUIsR0FBRyxRQUFRLENBQUM7UUFDL0IsZUFBVSxHQUFHLFdBQUksQ0FBQyxhQUFHLEVBQUUsRUFBRSxVQUFVLEVBQUUsUUFBUSxDQUFDLENBQUM7UUFDL0MsZ0JBQVcsR0FBRyxDQUFDLENBQUM7UUFDaEIsbUJBQWMsR0FBRyxHQUFHLENBQUM7UUFDckIscUJBQWdCLEdBQUcsSUFBSSxDQUFDO1FBQ3hCLG9CQUFlLEdBQUcsQ0FBQyxDQUFDO1FBQ3BCLHlCQUFvQixHQUFHLElBQUksQ0FBQztRQUM1QixpQkFBWSxHQUFHLEtBQUssQ0FBQztRQUNyQiw2QkFBd0IsR0FBRyxFQUFFLENBQUM7UUFDOUIsMEJBQTBCO1FBQzFCLDRCQUE0QjtRQUM1QixzQkFBc0I7UUFDdEIsNkJBQTZCO1FBQzdCLG1CQUFjLEdBQUcsZ0JBQWdCLEdBQUcsV0FBSSxDQUFDLGFBQUcsRUFBRSxFQUFFLEtBQUssRUFBRSxVQUFVLENBQUMsQ0FBQztRQUNuRSxxQkFBZ0IsR0FBRyxrQkFBa0IsQ0FBQztRQUN0QyxlQUFVLEdBQVcsZ0JBQWdCLENBQUM7UUFDdEMsMEJBQXFCLEdBQUcsQ0FBQyxDQUFDO0lBQzVCLENBQUM7Q0FBQTtBQXJDRCx3RUFxQ0MifQ==