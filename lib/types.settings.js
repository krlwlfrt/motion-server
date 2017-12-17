"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable */
class MotionSettings {
    constructor() {
        /**
         * Start in daemon (background) mode and release terminal (default: off)
         */
        this.daemon = 'off';
        /**
         * File to store the process ID, also called pid file. (default: not defined)
         */
        this.process_id_file = '/var/run/motion/motion.pid';
        /**
         * Start in Setup-Mode, daemon disabled. (default: off)
         */
        this.setup_mode = 'off';
        /**
         * Use a file to save logs messages, if not defined stderr and syslog is used. (default: not defined)
         */
        this['; logfile'] = '/tmp/motion.log';
        /**
         * Level of log messages [1..9] (EMG, ALR, CRT, ERR, WRN, NTC, INF, DBG, ALL). (default: 6 / NTC)
         */
        this.log_level = 6;
        /**
         * Filter to log messages by type (COR, STR, ENC, NET, DBL, EVT, TRK, VID, ALL). (default: ALL)
         */
        this.log_type = 'all';
        /**
         * Videodevice to be used for capturing  (default /dev/video0)
         * for FreeBSD default is /dev/bktr0
         */
        this.videodevice = '/dev/video0';
        /**
         * v4l2_palette allows one to choose preferable palette to be use by motion
         * See motion_guide.html for the valid options and values.  (default: 17)
         */
        this.v4l2_palette = 17;
        /**
         * Tuner device to be used for capturing using tuner as source (default /dev/tuner0)
         * This is ONLY used for FreeBSD. Leave it commented out for Linux
         */
        this['; tunerdevice'] = '/dev/tuner0';
        /**
         * The video input to be used (default: -1)
         * Should normally be set to 0 or 1 for video/TV cards, and -1 for USB cameras
         * Set to 0 for uvideo(4) on OpenBSD
         */
        this.input = '-1';
        /**
         * The video norm to use (only for video capture and TV tuner cards)
         * Values: 0 (PAL), 1 (NTSC), 2 (SECAM), 3 (PAL NC no colour). Default: 0 (PAL)
         */
        this.norm = 0;
        /**
         * The frequency to set the tuner to (kHz) (only for TV tuner cards) (default: 0)
         */
        this.frequency = 0;
        /**
         * Override the power line frequency for the webcam. (normally not necessary)
         * Values:
         * -1 : Do not modify device setting
         * 0  : Power line frequency Disabled
         * 1  : 50hz
         * 2  : 60hz
         * 3  : Auto
         */
        this.power_line_frequency = '-1';
        /**
         * Rotate image this number of degrees. The rotation affects all saved images as
         * well as movies. Valid values: 0 (default = no rotation), 90, 180 and 270.
         */
        this.rotate = 0;
        /**
         * Flip image over a given axis (vertical or horizontal), vertical means from left to right
         * horizontal means top to bottom. Valid values: none, v and h.
         */
        this.flip_axis = 'none';
        /**
         * Image width (pixels). Valid range: Camera dependent, default: 320
         */
        this.width = 320;
        /**
         * Image height (pixels). Valid range: Camera dependent, default: 240
         */
        this.height = 240;
        /**
         * Maximum number of frames to be captured per second.
         * Valid range: 2-100. Default: 100 (almost no limit).
         */
        this.framerate = 2;
        /**
         * Minimum time in seconds between capturing picture frames from the camera.
         * Default: 0 = disabled - the capture rate is given by the camera framerate.
         * This option is used when you want to capture images at a rate lower than 2 per second.
         */
        this.minimum_frame_time = 0;
        /**
         * Full Network Camera URL.  Valid Services: http:// ftp:// mjpg:// rtsp:// mjpeg:// file:// rtmp://
         */
        this['; netcam_url'] = 'value';
        /**
         * Username and password for network camera if required. Syntax is user:password
         */
        this['; netcam_userpass'] = 'value';
        /**
         * The setting for keep-alive of network socket, should improve performance on compatible net cameras.
         * off:   The historical implementation using HTTP/1.0, closing the socket after each http request.
         * force: Use HTTP/1.0 requests with keep alive header to reuse the same connection.
         * on:    Use HTTP/1.1 requests that support keep alive as default.
         * Default: off
         */
        this.netcam_keepalive = 'off';
        /**
         * URL to use for a netcam proxy server, if required, e.g. "http://myproxy".
         * If a port number other than 80 is needed, use "http://myproxy:1234".
         * Default: not defined
         */
        this['; netcam_proxy'] = 'value';
        /**
         * Set less strict jpeg checks for network cameras with a poor/buggy firmware.
         * Default: off
         */
        this.netcam_tolerant_check = 'off';
        /**
         * RTSP connection uses TCP to communicate to the camera. Can prevent image corruption.
         * Default: on
         */
        this.rtsp_uses_tcp = 'on';
        /**
         * Name of camera to use if you are using a camera accessed through OpenMax/MMAL
         * Default: Not defined
         */
        this['; mmalcam_name'] = 'vc.ril.camera';
        /**
         * Camera control parameters (see raspivid/raspistill tool documentation)
         * Default: Not defined
         */
        this['; mmalcam_control_params'] = '-hf';
        /**
         * Let motion regulate the brightness of a video device (default: off).
         * The auto_brightness feature uses the brightness option as its target value.
         * If brightness is zero auto_brightness will adjust to average brightness value 128.
         * Only recommended for cameras without auto brightness
         */
        this.auto_brightness = 'off';
        /**
         * Set the initial brightness of a video device.
         * If auto_brightness is enabled, this value defines the average brightness level
         * which Motion will try and adjust to.
         * Valid range 0-255, default 0 = disabled
         */
        this.brightness = 0;
        /**
         * Set the contrast of a video device.
         * Valid range 0-255, default 0 = disabled
         */
        this.contrast = 0;
        /**
         * Set the saturation of a video device.
         * Valid range 0-255, default 0 = disabled
         */
        this.saturation = 0;
        /**
         * Set the hue of a video device (NTSC feature).
         * Valid range 0-255, default 0 = disabled
         */
        this.hue = 0;
        /**
         * Number of frames to capture in each roundrobin step (default: 1)
         */
        this.roundrobin_frames = 1;
        /**
         * Number of frames to skip before each roundrobin step (default: 1)
         */
        this.roundrobin_skip = 1;
        /**
         * Try to filter out noise generated by roundrobin (default: off)
         */
        this.switchfilter = 'off';
        /**
         * Threshold for number of changed pixels in an image that
         * triggers motion detection (default: 1500)
         */
        this.threshold = 1500;
        /**
         * Automatically tune the threshold down if possible (default: off)
         */
        this.threshold_tune = 'off';
        /**
         * Noise threshold for the motion detection (default: 32)
         */
        this.noise_level = 32;
        /**
         * Automatically tune the noise threshold (default: on)
         */
        this.noise_tune = 'on';
        /**
         * Despeckle motion image using (e)rode or (d)ilate or (l)abel (Default: not defined)
         * Recommended value is EedDl. Any combination (and number of) of E, e, d, and D is valid.
         * (l)abeling must only be used once and the 'l' must be the last letter.
         * Comment out to disable
         */
        this.despeckle_filter = 'EedDl';
        /**
         * Detect motion in predefined areas (1 - 9). Areas are numbered like that:  1 2 3
         * A script (on_area_detected) is started immediately when motion is         4 5 6
         * detected in one of the given areas, but only once during an event.        7 8 9
         * One or more areas can be specified with this option. Take care: This option
         * does NOT restrict detection to these areas! (Default: not defined)
         */
        this['; area_detect'] = 'value';
        /**
         * PGM file to use as a sensitivity mask.
         * Full path name to. (Default: not defined)
         */
        this['; mask_file'] = 'value';
        /**
         * PGM file to completely mask out a area of image.
         * Full path name to. (Default: not defined)
         * mask_privacy value
         * Dynamically create a mask file during operation (default: 0)
         * Adjust speed of mask changes from 0 (off) to 10 (fast)
         */
        this.smart_mask_speed = 0;
        /**
         * Ignore sudden massive light intensity changes given as a percentage of the picture
         * area that changed intensity. Valid range: 0 - 100 , default: 0 = disabled
         */
        this.lightswitch = 0;
        /**
         * Picture frames must contain motion at least the specified number of frames
         * in a row before they are detected as true motion. At the default of 1, all
         * motion is detected. Valid range: 1 to thousands, recommended 1-5
         */
        this.minimum_motion_frames = 1;
        /**
         * Specifies the number of pre-captured (buffered) pictures from before motion
         * was detected that will be output at motion detection.
         * Recommended range: 0 to 5 (default: 0)
         * Do not use large values! Large values will cause Motion to skip video frames and
         * cause unsmooth movies. To smooth movies use larger values of post_capture instead.
         */
        this.pre_capture = 0;
        /**
         * Number of frames to capture after motion is no longer detected (default: 0)
         */
        this.post_capture = 0;
        /**
         * Event Gap is the seconds of no motion detection that triggers the end of an event.
         * An event is defined as a series of motion images taken within a short timeframe.
         * Recommended value is 60 seconds (Default). The value -1 is allowed and disables
         * events causing all Motion to be written to one single movie file and no pre_capture.
         * If set to 0, motion is running in gapless mode. Movies don't have gaps anymore. An
         * event ends right after no more motion is detected and post_capture is over.
         */
        this.event_gap = 60;
        /**
         * Maximum length in seconds of a movie
         * When value is exceeded a new movie file is created. (Default: 0 = infinite)
         */
        this.max_movie_time = 0;
        /**
         * Always save images even if there was no motion (default: off)
         */
        this.emulate_motion = 'off';
        /**
         * Output 'normal' pictures when motion is detected (default: off)
         * Valid values: on, off, first, best, center
         * When set to 'first', only the first picture of an event is saved.
         * Picture with most motion of an event is saved when set to 'best'.
         * Picture with motion nearest center of picture is saved when set to 'center'.
         * Can be used as preview shot for the corresponding movie.
         */
        this.output_pictures = 'off';
        /**
         * Output pictures with only the pixels moving object (ghost images) (default: off)
         */
        this.output_debug_pictures = 'off';
        /**
         * The quality (in percent) to be used by the jpeg and webp compression (default: 75)
         */
        this.quality = 75;
        /**
         * Type of output images
         * Valid values: jpeg, ppm or webp (default: jpeg)
         */
        this.picture_type = 'jpeg';
        /**
         * Use ffmpeg to encode videos of motion (default: off)
         */
        this.ffmpeg_output_movies = 'on';
        /**
         * Use ffmpeg to make videos showing the moving pixels (ghost images) (default: off)
         */
        this.ffmpeg_output_debug_movies = 'off';
        /**
         * Bitrate to be used by the ffmpeg encoder (default: 400000)
         * This option is ignored if ffmpeg_variable_bitrate is not 0 (disabled)
         */
        this.ffmpeg_bps = 400000;
        /**
         * Enables and defines variable bitrate for the ffmpeg encoder.
         * ffmpeg_bps is ignored if variable bitrate is enabled.
         * Valid values: 0 (default) = fixed bitrate defined by ffmpeg_bps,
         * or the range 1 - 100 where 1 means worst quality and 100 is best.
         */
        this.ffmpeg_variable_bitrate = 0;
        /**
         * Container/Codec output videos
         * Valid values: mpeg4, msmpeg4, swf,flv, ffv1, mov, mp4, mkv, hevc
         */
        this.ffmpeg_video_codec = 'mkv';
        /**
         * When creating videos, should frames be duplicated in order
         * to keep up with the requested frames per second
         * (default: true)
         */
        this.ffmpeg_duplicate_frames = 'true';
        /**
         * Interval in seconds between timelapse captures.  Default: 0 = off
         */
        this.timelapse_interval = 0;
        /**
         * Timelapse file rollover mode. See motion_guide.html for options and uses.
         */
        this.timelapse_mode = 'daily';
        /**
         * Frame rate for timelapse playback
         */
        this.timelapse_fps = 30;
        /**
         * Container/Codec for timelapse video. Valid values: mpg or mpeg4
         */
        this.timelapse_codec = 'mpg';
        /**
         * Bool to enable or disable extpipe (default: off)
         */
        this.use_extpipe = 'off';
        /**
      
         */
        this['; extpipe'] = 'ffmpeg -y -f rawvideo -pix_fmt yuv420p -video_size %wx%h -framerate %fps -i pipe:0 -vcodec libx264 -preset ultrafast -f mp4 %f.mp4';
        /**
         * Make automated snapshot every N seconds (default: 0 = disabled)
         */
        this.snapshot_interval = 0;
        /**
         * Locate and draw a box around the moving object.
         * Valid values: on, off, preview (default: off)
         * Set to 'preview' will only draw a box in preview_shot pictures.
         */
        this.locate_motion_mode = 'off';
        /**
         * Set the look and style of the locate box if enabled.
         * Valid values: box, redbox, cross, redcross (default: box)
         * Set to 'box' will draw the traditional box.
         * Set to 'redbox' will draw a red box.
         * Set to 'cross' will draw a little cross to mark center.
         * Set to 'redcross' will draw a little red cross to mark center.
         */
        this.locate_motion_style = 'box';
        /**
         * Draws the timestamp using same options as C function strftime(3)
         * Default: %Y-%m-%d\n%T = date in ISO format and time in 24 hour clock
         * Text is placed in lower right corner
         */
        this.text_right = '%Y-%m-%d\n%T-%q';
        /**
         * Draw a user defined text on the images using same options as C function strftime(3)
         * Default: Not defined = no text
         * Text is placed in lower left corner
         */
        this['; text_left'] = 'CAMERA %t';
        /**
         * Draw the number of changed pixed on the images (default: off)
         * Will normally be set to off except when you setup and adjust the motion settings
         * Text is placed in upper right corner
         */
        this.text_changes = 'off';
        /**
         * This option defines the value of the special event conversion specifier %C
         * You can use any conversion specifier in this option except %C. Date and time
         * values are from the timestamp of the first image in the current event.
         * Default: %Y%m%d%H%M%S
         * The idea is that %C can be used filenames and text_left/right for creating
         * a unique identifier for each event.
         */
        this.text_event = '%Y%m%d%H%M%S';
        /**
         * Draw characters at twice normal size on images. (default: off)
         */
        this.text_double = 'off';
        /**
         * Text to include in a JPEG EXIF comment
         * May be any text, including conversion specifiers.
         * The EXIF timestamp is included independent of this text.
         */
        this['; exif_text'] = '%i%J/%K%L';
        /**
         * Target base directory for pictures and films
         * Recommended to use absolute path. (Default: current working directory)
         * target_dir /tmp/motion
         * File path for snapshots (jpeg, ppm or webp) relative to target_dir
         * Default: %v-%Y%m%d%H%M%S-snapshot
         * Default value is equivalent to legacy oldlayout option
         * For Motion 3.0 compatible mode choose: %Y/%m/%d/%H/%M/%S-snapshot
         * File extension .jpg, .ppm or .webp is automatically added so do not include this.
         * Note: A symbolic link called lastsnap.jpg created in the target_dir will always
         * point to the latest snapshot, unless snapshot_filename is exactly 'lastsnap'
         */
        this.snapshot_filename = '%v-%Y%m%d%H%M%S-snapshot';
        /**
         * File path for motion triggered images (jpeg, ppm or .webp) relative to target_dir
         * Default: %v-%Y%m%d%H%M%S-%q
         * Default value is equivalent to legacy oldlayout option
         * For Motion 3.0 compatible mode choose: %Y/%m/%d/%H/%M/%S-%q
         * File extension .jpg, .ppm or .webp is automatically added so do not include this
         * Set to 'preview' together with best-preview feature enables special naming
         * convention for preview shots. See motion guide for details
         */
        this.picture_filename = '%v-%Y%m%d%H%M%S-%q';
        /**
         * File path for motion triggered ffmpeg films (movies) relative to target_dir
         * Default: %v-%Y%m%d%H%M%S
         * File extensions(.mpg .avi) are automatically added so do not include them
         */
        this.movie_filename = '%v-%Y%m%d%H%M%S';
        /**
         * File path for timelapse movies relative to target_dir
         * Default: %Y%m%d-timelapse
         * File extensions(.mpg .avi) are automatically added so do not include them
         */
        this.timelapse_filename = '%Y%m%d-timelapse';
        /**
         * Enable IPv6 (default: off)
         */
        this.ipv6_enabled = 'off';
        /**
         * The mini-http server listens to this port for requests (default: 0 = disabled)
         */
        this.stream_port = 8081;
        /**
         * 50% scaled down substream (default: 0 = disabled)
         * substream_port 8082
         * Quality of the jpeg (in percent) images produced (default: 50)
         */
        this.stream_quality = 50;
        /**
         * Output frames at 1 fps when no motion is detected and increase to the
         * rate given by stream_maxrate when motion is detected (default: off)
         */
        this.stream_motion = 'off';
        /**
         * Maximum framerate for stream streams (default: 1)
         */
        this.stream_maxrate = 1;
        /**
         * Restrict stream connections to localhost only (default: on)
         */
        this.stream_localhost = 'on';
        /**
         * Limits the number of images per connection (default: 0 = unlimited)
         * Number can be defined by multiplying actual stream rate by desired number of seconds
         * Actual stream rate is the smallest of the numbers framerate and stream_maxrate
         */
        this.stream_limit = 0;
        /**
         * Set the authentication method (default: 0)
         * 0 = disabled
         * 1 = Basic authentication
         * 2 = MD5 digest (the safer authentication)
         */
        this.stream_auth_method = 0;
        /**
         * Authentication for the stream. Syntax username:password
         * Default: not defined (Disabled)
         */
        this['; stream_authentication'] = 'username:password';
        /**
         * Percentage to scale the stream image for preview
         * This is scaled on the browser side, motion will keep sending full frames
         * Default: 25
         */
        this['; stream_preview_scale'] = 25;
        /**
         * Have stream preview image start on a new line
         * Default: no
         */
        this['; stream_preview_newline'] = 'no';
        /**
         * TCP/IP port for the http server to listen on (default: 0 = disabled)
         */
        this.webcontrol_port = 8080;
        /**
         * Restrict control connections to localhost only (default: on)
         */
        this.webcontrol_localhost = 'on';
        /**
         * Output for http server, select off to choose raw text plain (default: on)
         */
        this.webcontrol_html_output = 'on';
        /**
         * Authentication for the http based control. Syntax username:password
         * Default: not defined (Disabled)
         */
        this['; webcontrol_authentication'] = 'username:password';
        /**
         * Parameters to include on webcontrol.  0=none, 1=limited, 2=advanced, 3=restricted
         * Default: 0 (none)
         */
        this.webcontrol_parms = 0;
        /**
         * Type of tracker (0=none (default), 1=stepper, 2=iomojo, 3=pwc, 4=generic, 5=uvcvideo, 6=servo)
         * The generic type enables the definition of motion center and motion size to
         * be used with the conversion specifiers for options like on_motion_detected
         */
        this.track_type = 0;
        /**
         * Enable auto tracking (default: off)
         */
        this.track_auto = 'off';
        /**
         * Serial port of motor (default: none)
         */
        this['; track_port'] = '/dev/ttyS0';
        /**
         * Motor number for x-axis (default: 0)
         */
        this['; track_motorx'] = 0;
        /**
         * Set motorx reverse (default: 0)
         */
        this['; track_motorx_reverse'] = 0;
        /**
         * Motor number for y-axis (default: 0)
         */
        this['; track_motory'] = 1;
        /**
         * Set motory reverse (default: 0)
         */
        this['; track_motory_reverse'] = 0;
        /**
         * Maximum value on x-axis (default: 0)
         */
        this['; track_maxx'] = 200;
        /**
         * Minimum value on x-axis (default: 0)
         */
        this['; track_minx'] = 50;
        /**
         * Maximum value on y-axis (default: 0)
         */
        this['; track_maxy'] = 200;
        /**
         * Minimum value on y-axis (default: 0)
         */
        this['; track_miny'] = 50;
        /**
         * Center value on x-axis (default: 0)
         */
        this['; track_homex'] = 128;
        /**
         * Center value on y-axis (default: 0)
         */
        this['; track_homey'] = 128;
        /**
         * ID of an iomojo camera if used (default: 0)
         */
        this.track_iomojo_id = 0;
        /**
         * Angle in degrees the camera moves per step on the X-axis
         * with auto-track (default: 10)
         * Currently only used with pwc type cameras
         */
        this.track_step_angle_x = 10;
        /**
         * Angle in degrees the camera moves per step on the Y-axis
         * with auto-track (default: 10)
         * Currently only used with pwc type cameras
         */
        this.track_step_angle_y = 10;
        /**
         * Delay to wait for after tracking movement as number
         * of picture frames (default: 10)
         */
        this.track_move_wait = 10;
        /**
         * Speed to set the motor to (stepper motor option) (default: 255)
         */
        this.track_speed = 255;
        /**
         * Number of steps to make (stepper motor option) (default: 40)
         */
        this.track_stepsize = 40;
        /**
         * Do not sound beeps when detecting motion (default: on)
         * Note: Motion never beeps when running in daemon mode.
         */
        this.quiet = 'on';
        /**
         * Command to be executed when an event starts. (default: none)
         * An event starts at first motion detected after a period of no motion defined by event_gap
         */
        this['; on_event_start'] = 'value';
        /**
         * Command to be executed when an event ends after a period of no motion
         * (default: none). The period of no motion is defined by option event_gap.
         */
        this['; on_event_end'] = 'value';
        /**
         * Command to be executed when a picture (.ppm|.jpg) is saved (default: none)
         * To give the filename as an argument to a command append it with %f
         */
        this['; on_picture_save'] = 'value';
        /**
         * Command to be executed when a motion frame is detected (default: none)
         */
        this['; on_motion_detected'] = 'value';
        /**
         * Command to be executed when motion in a predefined area is detected
         * Check option 'area_detect'.   (default: none)
         */
        this['; on_area_detected'] = 'value';
        /**
         * Command to be executed when a movie file (.mpg|.avi) is created. (default: none)
         * To give the filename as an argument to a command append it with %f
         */
        this['; on_movie_start'] = 'value';
        /**
         * Command to be executed when a movie file (.mpg|.avi) is closed. (default: none)
         * To give the filename as an argument to a command append it with %f
         */
        this['; on_movie_end'] = 'value';
        /**
         * Command to be executed when a camera can't be opened or if it is lost
         * NOTE: There is situations when motion don't detect a lost camera!
         * It depends on the driver, some drivers dosn't detect a lost camera at all
         * Some hangs the motion thread. Some even hangs the PC! (default: none)
         */
        this['; on_camera_lost'] = 'value';
        /**
         * Command to be executed when a camera that was lost has been found (default: none)
         * NOTE: If motion doesn't properly detect a lost camera, it also won't know it found one.
         */
        this['; on_camera_found'] = 'value';
        /**
         * Log to the database when creating motion triggered picture file  (default: on)
         */
        this['; sql_log_picture'] = 'on';
        /**
         * Log to the database when creating a snapshot image file (default: on)
         */
        this['; sql_log_snapshot'] = 'on';
        /**
         * Log to the database when creating motion triggered movie file (default: off)
         */
        this['; sql_log_movie'] = 'off';
        /**
         * Log to the database when creating timelapse movies file (default: off)
         */
        this['; sql_log_timelapse'] = 'off';
        /**
         * Mysql
         * CREATE TABLE security (camera int, filename char(80) not null, frame int, file_type int, time_stamp timestamp(14), event_time_stamp timestamp(14));
         *
         * Postgresql
         * CREATE TABLE security (camera int, filename char(80) not null, frame int, file_type int, time_stamp timestamp without time zone, event_time_stamp timestamp without time zone);
         *
         * insert into security(camera, filename, frame, file_type, time_stamp, text_event) values('%t', '%f', '%q', '%n', '%Y-%m-%d %T', '%C')
         */
        this['; sql_query'] = 'insert into security(camera, filename, frame, file_type, time_stamp, event_time_stamp) values(\'%t\', \'%f\', \'%q\', \'%n\', \'%Y-%m-%d %T\', \'%C\')';
        /**
         * database type : mysql, postgresql, sqlite3 (default : not defined)
         */
        this['; database_type'] = 'value';
        /**
         * database to log to (default: not defined)
         * for sqlite3, the full path and name for the database.
         */
        this['; database_dbname'] = 'value';
        /**
         * The host on which the database is located (default: localhost)
         */
        this['; database_host'] = 'value';
        /**
         * User account name for database (default: not defined)
         */
        this['; database_user'] = 'value';
        /**
         * User password for database (default: not defined)
         */
        this['; database_password'] = 'value';
        /**
         * Port on which the database is located
         *  mysql 3306 , postgresql 5432 (default: not defined)
         */
        this['; database_port'] = 'value';
        /**
         * Database wait time in milliseconds for locked database to
         * be unlocked before returning database locked error (default 0)
         */
        this['; database_busy_timeout'] = 0;
        /**
         * Output images to a video4linux loopback device
         * Specify the device associated with the loopback device
         * For example /dev/video1 (default: not defined)
         */
        this['; video_pipe'] = 'value';
        /**
         * Output motion images to a video4linux loopback device
         * Specify the device associated with the loopback device
         * For example /dev/video1 (default: not defined)
         */
        this['; motion_video_pipe'] = 'value';
        /**
      
         */
        this['; camera'] = '/etc/motion/camera4.conf';
        /**
      
         */
        this['; camera_dir'] = '/etc/motion/conf.d';
    }
}
exports.MotionSettings = MotionSettings;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidHlwZXMuc2V0dGluZ3MuanMiLCJzb3VyY2VSb290IjoiL2hvbWUvd3VsZmVydC9wcml2YXRlL21vdGlvbi9zZXJ2ZXIvc3JjLyIsInNvdXJjZXMiOlsidHlwZXMuc2V0dGluZ3MudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxvQkFBb0I7QUFDcEI7SUFBQTtRQUNFOztXQUVHO1FBQ0gsV0FBTSxHQUFXLEtBQUssQ0FBQztRQUV2Qjs7V0FFRztRQUNILG9CQUFlLEdBQVcsNEJBQTRCLENBQUM7UUFFdkQ7O1dBRUc7UUFDSCxlQUFVLEdBQVcsS0FBSyxDQUFDO1FBRTNCOztXQUVHO1FBQ0gsaUJBQVcsR0FBWSxpQkFBaUIsQ0FBQztRQUV6Qzs7V0FFRztRQUNILGNBQVMsR0FBVyxDQUFDLENBQUM7UUFFdEI7O1dBRUc7UUFDSCxhQUFRLEdBQVcsS0FBSyxDQUFDO1FBRXpCOzs7V0FHRztRQUNILGdCQUFXLEdBQVcsYUFBYSxDQUFDO1FBRXBDOzs7V0FHRztRQUNILGlCQUFZLEdBQVcsRUFBRSxDQUFDO1FBRTFCOzs7V0FHRztRQUNILHFCQUFlLEdBQVksYUFBYSxDQUFDO1FBRXpDOzs7O1dBSUc7UUFDSCxVQUFLLEdBQVcsSUFBSSxDQUFDO1FBRXJCOzs7V0FHRztRQUNILFNBQUksR0FBVyxDQUFDLENBQUM7UUFFakI7O1dBRUc7UUFDSCxjQUFTLEdBQVcsQ0FBQyxDQUFDO1FBRXRCOzs7Ozs7OztXQVFHO1FBQ0gseUJBQW9CLEdBQVcsSUFBSSxDQUFDO1FBRXBDOzs7V0FHRztRQUNILFdBQU0sR0FBVyxDQUFDLENBQUM7UUFFbkI7OztXQUdHO1FBQ0gsY0FBUyxHQUFXLE1BQU0sQ0FBQztRQUUzQjs7V0FFRztRQUNILFVBQUssR0FBVyxHQUFHLENBQUM7UUFFcEI7O1dBRUc7UUFDSCxXQUFNLEdBQVcsR0FBRyxDQUFDO1FBRXJCOzs7V0FHRztRQUNILGNBQVMsR0FBVyxDQUFDLENBQUM7UUFFdEI7Ozs7V0FJRztRQUNILHVCQUFrQixHQUFXLENB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