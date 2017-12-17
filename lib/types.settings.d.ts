export declare class MotionSettings {
    /**
     * Start in daemon (background) mode and release terminal (default: off)
     */
    daemon: string;
    /**
     * File to store the process ID, also called pid file. (default: not defined)
     */
    process_id_file: string;
    /**
     * Start in Setup-Mode, daemon disabled. (default: off)
     */
    setup_mode: string;
    /**
     * Use a file to save logs messages, if not defined stderr and syslog is used. (default: not defined)
     */
    '; logfile'?: string;
    /**
     * Level of log messages [1..9] (EMG, ALR, CRT, ERR, WRN, NTC, INF, DBG, ALL). (default: 6 / NTC)
     */
    log_level: number;
    /**
     * Filter to log messages by type (COR, STR, ENC, NET, DBL, EVT, TRK, VID, ALL). (default: ALL)
     */
    log_type: string;
    /**
     * Videodevice to be used for capturing  (default /dev/video0)
     * for FreeBSD default is /dev/bktr0
     */
    videodevice: string;
    /**
     * v4l2_palette allows one to choose preferable palette to be use by motion
     * See motion_guide.html for the valid options and values.  (default: 17)
     */
    v4l2_palette: number;
    /**
     * Tuner device to be used for capturing using tuner as source (default /dev/tuner0)
     * This is ONLY used for FreeBSD. Leave it commented out for Linux
     */
    '; tunerdevice'?: string;
    /**
     * The video input to be used (default: -1)
     * Should normally be set to 0 or 1 for video/TV cards, and -1 for USB cameras
     * Set to 0 for uvideo(4) on OpenBSD
     */
    input: string;
    /**
     * The video norm to use (only for video capture and TV tuner cards)
     * Values: 0 (PAL), 1 (NTSC), 2 (SECAM), 3 (PAL NC no colour). Default: 0 (PAL)
     */
    norm: number;
    /**
     * The frequency to set the tuner to (kHz) (only for TV tuner cards) (default: 0)
     */
    frequency: number;
    /**
     * Override the power line frequency for the webcam. (normally not necessary)
     * Values:
     * -1 : Do not modify device setting
     * 0  : Power line frequency Disabled
     * 1  : 50hz
     * 2  : 60hz
     * 3  : Auto
     */
    power_line_frequency: string;
    /**
     * Rotate image this number of degrees. The rotation affects all saved images as
     * well as movies. Valid values: 0 (default = no rotation), 90, 180 and 270.
     */
    rotate: number;
    /**
     * Flip image over a given axis (vertical or horizontal), vertical means from left to right
     * horizontal means top to bottom. Valid values: none, v and h.
     */
    flip_axis: string;
    /**
     * Image width (pixels). Valid range: Camera dependent, default: 320
     */
    width: number;
    /**
     * Image height (pixels). Valid range: Camera dependent, default: 240
     */
    height: number;
    /**
     * Maximum number of frames to be captured per second.
     * Valid range: 2-100. Default: 100 (almost no limit).
     */
    framerate: number;
    /**
     * Minimum time in seconds between capturing picture frames from the camera.
     * Default: 0 = disabled - the capture rate is given by the camera framerate.
     * This option is used when you want to capture images at a rate lower than 2 per second.
     */
    minimum_frame_time: number;
    /**
     * Full Network Camera URL.  Valid Services: http:// ftp:// mjpg:// rtsp:// mjpeg:// file:// rtmp://
     */
    '; netcam_url'?: string;
    /**
     * Username and password for network camera if required. Syntax is user:password
     */
    '; netcam_userpass'?: string;
    /**
     * The setting for keep-alive of network socket, should improve performance on compatible net cameras.
     * off:   The historical implementation using HTTP/1.0, closing the socket after each http request.
     * force: Use HTTP/1.0 requests with keep alive header to reuse the same connection.
     * on:    Use HTTP/1.1 requests that support keep alive as default.
     * Default: off
     */
    netcam_keepalive: string;
    /**
     * URL to use for a netcam proxy server, if required, e.g. "http://myproxy".
     * If a port number other than 80 is needed, use "http://myproxy:1234".
     * Default: not defined
     */
    '; netcam_proxy'?: string;
    /**
     * Set less strict jpeg checks for network cameras with a poor/buggy firmware.
     * Default: off
     */
    netcam_tolerant_check: string;
    /**
     * RTSP connection uses TCP to communicate to the camera. Can prevent image corruption.
     * Default: on
     */
    rtsp_uses_tcp: string;
    /**
     * Name of camera to use if you are using a camera accessed through OpenMax/MMAL
     * Default: Not defined
     */
    '; mmalcam_name'?: string;
    /**
     * Camera control parameters (see raspivid/raspistill tool documentation)
     * Default: Not defined
     */
    '; mmalcam_control_params'?: string;
    /**
     * Let motion regulate the brightness of a video device (default: off).
     * The auto_brightness feature uses the brightness option as its target value.
     * If brightness is zero auto_brightness will adjust to average brightness value 128.
     * Only recommended for cameras without auto brightness
     */
    auto_brightness: string;
    /**
     * Set the initial brightness of a video device.
     * If auto_brightness is enabled, this value defines the average brightness level
     * which Motion will try and adjust to.
     * Valid range 0-255, default 0 = disabled
     */
    brightness: number;
    /**
     * Set the contrast of a video device.
     * Valid range 0-255, default 0 = disabled
     */
    contrast: number;
    /**
     * Set the saturation of a video device.
     * Valid range 0-255, default 0 = disabled
     */
    saturation: number;
    /**
     * Set the hue of a video device (NTSC feature).
     * Valid range 0-255, default 0 = disabled
     */
    hue: number;
    /**
     * Number of frames to capture in each roundrobin step (default: 1)
     */
    roundrobin_frames: number;
    /**
     * Number of frames to skip before each roundrobin step (default: 1)
     */
    roundrobin_skip: number;
    /**
     * Try to filter out noise generated by roundrobin (default: off)
     */
    switchfilter: string;
    /**
     * Threshold for number of changed pixels in an image that
     * triggers motion detection (default: 1500)
     */
    threshold: number;
    /**
     * Automatically tune the threshold down if possible (default: off)
     */
    threshold_tune: string;
    /**
     * Noise threshold for the motion detection (default: 32)
     */
    noise_level: number;
    /**
     * Automatically tune the noise threshold (default: on)
     */
    noise_tune: string;
    /**
     * Despeckle motion image using (e)rode or (d)ilate or (l)abel (Default: not defined)
     * Recommended value is EedDl. Any combination (and number of) of E, e, d, and D is valid.
     * (l)abeling must only be used once and the 'l' must be the last letter.
     * Comment out to disable
     */
    despeckle_filter: string;
    /**
     * Detect motion in predefined areas (1 - 9). Areas are numbered like that:  1 2 3
     * A script (on_area_detected) is started immediately when motion is         4 5 6
     * detected in one of the given areas, but only once during an event.        7 8 9
     * One or more areas can be specified with this option. Take care: This option
     * does NOT restrict detection to these areas! (Default: not defined)
     */
    '; area_detect'?: string;
    /**
     * PGM file to use as a sensitivity mask.
     * Full path name to. (Default: not defined)
     */
    '; mask_file'?: string;
    /**
     * PGM file to completely mask out a area of image.
     * Full path name to. (Default: not defined)
     * mask_privacy value
     * Dynamically create a mask file during operation (default: 0)
     * Adjust speed of mask changes from 0 (off) to 10 (fast)
     */
    smart_mask_speed: number;
    /**
     * Ignore sudden massive light intensity changes given as a percentage of the picture
     * area that changed intensity. Valid range: 0 - 100 , default: 0 = disabled
     */
    lightswitch: number;
    /**
     * Picture frames must contain motion at least the specified number of frames
     * in a row before they are detected as true motion. At the default of 1, all
     * motion is detected. Valid range: 1 to thousands, recommended 1-5
     */
    minimum_motion_frames: number;
    /**
     * Specifies the number of pre-captured (buffered) pictures from before motion
     * was detected that will be output at motion detection.
     * Recommended range: 0 to 5 (default: 0)
     * Do not use large values! Large values will cause Motion to skip video frames and
     * cause unsmooth movies. To smooth movies use larger values of post_capture instead.
     */
    pre_capture: number;
    /**
     * Number of frames to capture after motion is no longer detected (default: 0)
     */
    post_capture: number;
    /**
     * Event Gap is the seconds of no motion detection that triggers the end of an event.
     * An event is defined as a series of motion images taken within a short timeframe.
     * Recommended value is 60 seconds (Default). The value -1 is allowed and disables
     * events causing all Motion to be written to one single movie file and no pre_capture.
     * If set to 0, motion is running in gapless mode. Movies don't have gaps anymore. An
     * event ends right after no more motion is detected and post_capture is over.
     */
    event_gap: number;
    /**
     * Maximum length in seconds of a movie
     * When value is exceeded a new movie file is created. (Default: 0 = infinite)
     */
    max_movie_time: number;
    /**
     * Always save images even if there was no motion (default: off)
     */
    emulate_motion: string;
    /**
     * Output 'normal' pictures when motion is detected (default: off)
     * Valid values: on, off, first, best, center
     * When set to 'first', only the first picture of an event is saved.
     * Picture with most motion of an event is saved when set to 'best'.
     * Picture with motion nearest center of picture is saved when set to 'center'.
     * Can be used as preview shot for the corresponding movie.
     */
    output_pictures: string;
    /**
     * Output pictures with only the pixels moving object (ghost images) (default: off)
     */
    output_debug_pictures: string;
    /**
     * The quality (in percent) to be used by the jpeg and webp compression (default: 75)
     */
    quality: number;
    /**
     * Type of output images
     * Valid values: jpeg, ppm or webp (default: jpeg)
     */
    picture_type: string;
    /**
     * Use ffmpeg to encode videos of motion (default: off)
     */
    ffmpeg_output_movies: string;
    /**
     * Use ffmpeg to make videos showing the moving pixels (ghost images) (default: off)
     */
    ffmpeg_output_debug_movies: string;
    /**
     * Bitrate to be used by the ffmpeg encoder (default: 400000)
     * This option is ignored if ffmpeg_variable_bitrate is not 0 (disabled)
     */
    ffmpeg_bps: number;
    /**
     * Enables and defines variable bitrate for the ffmpeg encoder.
     * ffmpeg_bps is ignored if variable bitrate is enabled.
     * Valid values: 0 (default) = fixed bitrate defined by ffmpeg_bps,
     * or the range 1 - 100 where 1 means worst quality and 100 is best.
     */
    ffmpeg_variable_bitrate: number;
    /**
     * Container/Codec output videos
     * Valid values: mpeg4, msmpeg4, swf,flv, ffv1, mov, mp4, mkv, hevc
     */
    ffmpeg_video_codec: string;
    /**
     * When creating videos, should frames be duplicated in order
     * to keep up with the requested frames per second
     * (default: true)
     */
    ffmpeg_duplicate_frames: string;
    /**
     * Interval in seconds between timelapse captures.  Default: 0 = off
     */
    timelapse_interval: number;
    /**
     * Timelapse file rollover mode. See motion_guide.html for options and uses.
     */
    timelapse_mode: string;
    /**
     * Frame rate for timelapse playback
     */
    timelapse_fps: number;
    /**
     * Container/Codec for timelapse video. Valid values: mpg or mpeg4
     */
    timelapse_codec: string;
    /**
     * Bool to enable or disable extpipe (default: off)
     */
    use_extpipe: string;
    /**
  
     */
    '; extpipe'?: string;
    /**
     * Make automated snapshot every N seconds (default: 0 = disabled)
     */
    snapshot_interval: number;
    /**
     * Locate and draw a box around the moving object.
     * Valid values: on, off, preview (default: off)
     * Set to 'preview' will only draw a box in preview_shot pictures.
     */
    locate_motion_mode: string;
    /**
     * Set the look and style of the locate box if enabled.
     * Valid values: box, redbox, cross, redcross (default: box)
     * Set to 'box' will draw the traditional box.
     * Set to 'redbox' will draw a red box.
     * Set to 'cross' will draw a little cross to mark center.
     * Set to 'redcross' will draw a little red cross to mark center.
     */
    locate_motion_style: string;
    /**
     * Draws the timestamp using same options as C function strftime(3)
     * Default: %Y-%m-%d\n%T = date in ISO format and time in 24 hour clock
     * Text is placed in lower right corner
     */
    text_right: string;
    /**
     * Draw a user defined text on the images using same options as C function strftime(3)
     * Default: Not defined = no text
     * Text is placed in lower left corner
     */
    '; text_left'?: string;
    /**
     * Draw the number of changed pixed on the images (default: off)
     * Will normally be set to off except when you setup and adjust the motion settings
     * Text is placed in upper right corner
     */
    text_changes: string;
    /**
     * This option defines the value of the special event conversion specifier %C
     * You can use any conversion specifier in this option except %C. Date and time
     * values are from the timestamp of the first image in the current event.
     * Default: %Y%m%d%H%M%S
     * The idea is that %C can be used filenames and text_left/right for creating
     * a unique identifier for each event.
     */
    text_event: string;
    /**
     * Draw characters at twice normal size on images. (default: off)
     */
    text_double: string;
    /**
     * Text to include in a JPEG EXIF comment
     * May be any text, including conversion specifiers.
     * The EXIF timestamp is included independent of this text.
     */
    '; exif_text'?: string;
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
    snapshot_filename: string;
    /**
     * File path for motion triggered images (jpeg, ppm or .webp) relative to target_dir
     * Default: %v-%Y%m%d%H%M%S-%q
     * Default value is equivalent to legacy oldlayout option
     * For Motion 3.0 compatible mode choose: %Y/%m/%d/%H/%M/%S-%q
     * File extension .jpg, .ppm or .webp is automatically added so do not include this
     * Set to 'preview' together with best-preview feature enables special naming
     * convention for preview shots. See motion guide for details
     */
    picture_filename: string;
    /**
     * File path for motion triggered ffmpeg films (movies) relative to target_dir
     * Default: %v-%Y%m%d%H%M%S
     * File extensions(.mpg .avi) are automatically added so do not include them
     */
    movie_filename: string;
    /**
     * File path for timelapse movies relative to target_dir
     * Default: %Y%m%d-timelapse
     * File extensions(.mpg .avi) are automatically added so do not include them
     */
    timelapse_filename: string;
    /**
     * Enable IPv6 (default: off)
     */
    ipv6_enabled: string;
    /**
     * The mini-http server listens to this port for requests (default: 0 = disabled)
     */
    stream_port: number;
    /**
     * 50% scaled down substream (default: 0 = disabled)
     * substream_port 8082
     * Quality of the jpeg (in percent) images produced (default: 50)
     */
    stream_quality: number;
    /**
     * Output frames at 1 fps when no motion is detected and increase to the
     * rate given by stream_maxrate when motion is detected (default: off)
     */
    stream_motion: string;
    /**
     * Maximum framerate for stream streams (default: 1)
     */
    stream_maxrate: number;
    /**
     * Restrict stream connections to localhost only (default: on)
     */
    stream_localhost: string;
    /**
     * Limits the number of images per connection (default: 0 = unlimited)
     * Number can be defined by multiplying actual stream rate by desired number of seconds
     * Actual stream rate is the smallest of the numbers framerate and stream_maxrate
     */
    stream_limit: number;
    /**
     * Set the authentication method (default: 0)
     * 0 = disabled
     * 1 = Basic authentication
     * 2 = MD5 digest (the safer authentication)
     */
    stream_auth_method: number;
    /**
     * Authentication for the stream. Syntax username:password
     * Default: not defined (Disabled)
     */
    '; stream_authentication'?: string;
    /**
     * Percentage to scale the stream image for preview
     * This is scaled on the browser side, motion will keep sending full frames
     * Default: 25
     */
    '; stream_preview_scale'?: number;
    /**
     * Have stream preview image start on a new line
     * Default: no
     */
    '; stream_preview_newline'?: string;
    /**
     * TCP/IP port for the http server to listen on (default: 0 = disabled)
     */
    webcontrol_port: number;
    /**
     * Restrict control connections to localhost only (default: on)
     */
    webcontrol_localhost: string;
    /**
     * Output for http server, select off to choose raw text plain (default: on)
     */
    webcontrol_html_output: string;
    /**
     * Authentication for the http based control. Syntax username:password
     * Default: not defined (Disabled)
     */
    '; webcontrol_authentication'?: string;
    /**
     * Parameters to include on webcontrol.  0=none, 1=limited, 2=advanced, 3=restricted
     * Default: 0 (none)
     */
    webcontrol_parms: number;
    /**
     * Type of tracker (0=none (default), 1=stepper, 2=iomojo, 3=pwc, 4=generic, 5=uvcvideo, 6=servo)
     * The generic type enables the definition of motion center and motion size to
     * be used with the conversion specifiers for options like on_motion_detected
     */
    track_type: number;
    /**
     * Enable auto tracking (default: off)
     */
    track_auto: string;
    /**
     * Serial port of motor (default: none)
     */
    '; track_port'?: string;
    /**
     * Motor number for x-axis (default: 0)
     */
    '; track_motorx'?: number;
    /**
     * Set motorx reverse (default: 0)
     */
    '; track_motorx_reverse'?: number;
    /**
     * Motor number for y-axis (default: 0)
     */
    '; track_motory'?: number;
    /**
     * Set motory reverse (default: 0)
     */
    '; track_motory_reverse'?: number;
    /**
     * Maximum value on x-axis (default: 0)
     */
    '; track_maxx'?: number;
    /**
     * Minimum value on x-axis (default: 0)
     */
    '; track_minx'?: number;
    /**
     * Maximum value on y-axis (default: 0)
     */
    '; track_maxy'?: number;
    /**
     * Minimum value on y-axis (default: 0)
     */
    '; track_miny'?: number;
    /**
     * Center value on x-axis (default: 0)
     */
    '; track_homex'?: number;
    /**
     * Center value on y-axis (default: 0)
     */
    '; track_homey'?: number;
    /**
     * ID of an iomojo camera if used (default: 0)
     */
    track_iomojo_id: number;
    /**
     * Angle in degrees the camera moves per step on the X-axis
     * with auto-track (default: 10)
     * Currently only used with pwc type cameras
     */
    track_step_angle_x: number;
    /**
     * Angle in degrees the camera moves per step on the Y-axis
     * with auto-track (default: 10)
     * Currently only used with pwc type cameras
     */
    track_step_angle_y: number;
    /**
     * Delay to wait for after tracking movement as number
     * of picture frames (default: 10)
     */
    track_move_wait: number;
    /**
     * Speed to set the motor to (stepper motor option) (default: 255)
     */
    track_speed: number;
    /**
     * Number of steps to make (stepper motor option) (default: 40)
     */
    track_stepsize: number;
    /**
     * Do not sound beeps when detecting motion (default: on)
     * Note: Motion never beeps when running in daemon mode.
     */
    quiet: string;
    /**
     * Command to be executed when an event starts. (default: none)
     * An event starts at first motion detected after a period of no motion defined by event_gap
     */
    '; on_event_start'?: string;
    /**
     * Command to be executed when an event ends after a period of no motion
     * (default: none). The period of no motion is defined by option event_gap.
     */
    '; on_event_end'?: string;
    /**
     * Command to be executed when a picture (.ppm|.jpg) is saved (default: none)
     * To give the filename as an argument to a command append it with %f
     */
    '; on_picture_save'?: string;
    /**
     * Command to be executed when a motion frame is detected (default: none)
     */
    '; on_motion_detected'?: string;
    /**
     * Command to be executed when motion in a predefined area is detected
     * Check option 'area_detect'.   (default: none)
     */
    '; on_area_detected'?: string;
    /**
     * Command to be executed when a movie file (.mpg|.avi) is created. (default: none)
     * To give the filename as an argument to a command append it with %f
     */
    '; on_movie_start'?: string;
    /**
     * Command to be executed when a movie file (.mpg|.avi) is closed. (default: none)
     * To give the filename as an argument to a command append it with %f
     */
    '; on_movie_end'?: string;
    /**
     * Command to be executed when a camera can't be opened or if it is lost
     * NOTE: There is situations when motion don't detect a lost camera!
     * It depends on the driver, some drivers dosn't detect a lost camera at all
     * Some hangs the motion thread. Some even hangs the PC! (default: none)
     */
    '; on_camera_lost'?: string;
    /**
     * Command to be executed when a camera that was lost has been found (default: none)
     * NOTE: If motion doesn't properly detect a lost camera, it also won't know it found one.
     */
    '; on_camera_found'?: string;
    /**
     * Log to the database when creating motion triggered picture file  (default: on)
     */
    '; sql_log_picture'?: string;
    /**
     * Log to the database when creating a snapshot image file (default: on)
     */
    '; sql_log_snapshot'?: string;
    /**
     * Log to the database when creating motion triggered movie file (default: off)
     */
    '; sql_log_movie'?: string;
    /**
     * Log to the database when creating timelapse movies file (default: off)
     */
    '; sql_log_timelapse'?: string;
    /**
     * Mysql
     * CREATE TABLE security (camera int, filename char(80) not null, frame int, file_type int, time_stamp timestamp(14), event_time_stamp timestamp(14));
     *
     * Postgresql
     * CREATE TABLE security (camera int, filename char(80) not null, frame int, file_type int, time_stamp timestamp without time zone, event_time_stamp timestamp without time zone);
     *
     * insert into security(camera, filename, frame, file_type, time_stamp, text_event) values('%t', '%f', '%q', '%n', '%Y-%m-%d %T', '%C')
     */
    '; sql_query'?: string;
    /**
     * database type : mysql, postgresql, sqlite3 (default : not defined)
     */
    '; database_type'?: string;
    /**
     * database to log to (default: not defined)
     * for sqlite3, the full path and name for the database.
     */
    '; database_dbname'?: string;
    /**
     * The host on which the database is located (default: localhost)
     */
    '; database_host'?: string;
    /**
     * User account name for database (default: not defined)
     */
    '; database_user'?: string;
    /**
     * User password for database (default: not defined)
     */
    '; database_password'?: string;
    /**
     * Port on which the database is located
     *  mysql 3306 , postgresql 5432 (default: not defined)
     */
    '; database_port'?: string;
    /**
     * Database wait time in milliseconds for locked database to
     * be unlocked before returning database locked error (default 0)
     */
    '; database_busy_timeout'?: number;
    /**
     * Output images to a video4linux loopback device
     * Specify the device associated with the loopback device
     * For example /dev/video1 (default: not defined)
     */
    '; video_pipe'?: string;
    /**
     * Output motion images to a video4linux loopback device
     * Specify the device associated with the loopback device
     * For example /dev/video1 (default: not defined)
     */
    '; motion_video_pipe'?: string;
    /**
  
     */
    '; camera'?: string;
    /**
  
     */
    '; camera_dir'?: string;
}
