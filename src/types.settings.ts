/* tslint:disable */
export class Settings {
  /**
   * Start in daemon (background) mode and release terminal.
   */
  daemon: string = 'off';

  /**
   * Start in Setup-Mode, daemon disabled.
   */
  setup_mode: string = 'off';

  /**
   * File to store the process ID.
   */
  '; pid_file'?: string = 'value';

  /**
   * File to write logs messages into.  If not defined stderr and syslog is used.
   */
  '; log_file'?: string = 'value';

  /**
   * Level of log messages [1..9] (EMG, ALR, CRT, ERR, WRN, NTC, INF, DBG, ALL).
   */
  log_level: number = 6;

  /**
   * Target directory for pictures, snapshots and movies
   */
  '; target_dir'?: string = 'value';

  /**
   * Video device (e.g. /dev/video0) to be used for capturing.
   */
  videodevice: string = '/dev/video0';

  /**
   * Parameters to control video device.  See motion_guide.html
   */
  '; vid_control_params'?: string = 'value';

  /**
   * The full URL of the network camera stream.
   */
  '; netcam_url'?: string = 'value';

  /**
   * Name of mmal camera (e.g. vc.ril.camera for pi camera).
   */
  '; mmalcam_name'?: string = 'value';

  /**
   * Camera control parameters (see raspivid/raspistill tool documentation)
   */
  '; mmalcam_control_params'?: string = 'value';

  /**
   * Image width in pixels.
   */
  width: number = 640;

  /**
   * Image height in pixels.
   */
  height: number = 480;

  /**
   * Maximum number of frames to be captured per second.
   */
  framerate: number = 15;

  /**
   * Text to be overlayed in the lower left corner of images
   */
  text_left: string = 'CAMERA1';

  /**
   * Text to be overlayed in the lower right corner of images.
   */
  text_right: string = '%Y-%m-%d\n%T-%q';

  /**
   * Always save pictures and movies even if there was no motion.
   */
  emulate_motion: string = 'off';

  /**
   * Threshold for number of changed pixels that triggers motion.
   */
  threshold: number = 1500;

  /**
   * Noise threshold for the motion detection.
   */
  '; noise_level'?: number = 32;

  /**
   * Despeckle the image using (E/e)rode or (D/d)ilate or (l)abel.
   */
  despeckle_filter: string = 'EedDl';

  /**
   * Number of images that must contain motion to trigger an event.
   */
  minimum_motion_frames: number = 1;

  /**
   * Gap in seconds of no motion detected that triggers the end of an event.
   */
  event_gap: number = 60;

  /**
   * The number of pre-captured (buffered) pictures from before motion.
   */
  pre_capture: number = 3;

  /**
   * Number of frames to capture after motion is no longer detected.
   */
  post_capture: number = 0;

  /**
   * Command to be executed when an event starts.
   */
  '; on_event_start'?: string = 'value';

  /**
   * Command to be executed when an event ends.
   */
  '; on_event_end'?: string = 'value';

  /**
   * Command to be executed when a movie file is closed.
   */
  '; on_movie_end'?: string = 'value';

  /**
   * Output pictures when motion is detected
   */
  picture_output: string = 'off';

  /**
   * File name(without extension) for pictures relative to target directory
   */
  picture_filename: string = '%Y%m%d%H%M%S-%q';

  /**
   * Create movies of motion events.
   */
  movie_output: string = 'on';

  /**
   * Maximum length of movie in seconds.
   */
  movie_max_time: number = 60;

  /**
   * The encoding quality of the movie. (0=use bitrate. 1=worst quality, 100=best)
   */
  movie_quality: number = 45;

  /**
   * Container/Codec to used for the movie. See motion_guide.html
   */
  movie_codec: string = 'mkv';

  /**
   * File name(without extension) for movies relative to target directory
   */
  movie_filename: string = '%t-%v-%Y%m%d%H%M%S';

  /**
   * Port number used for the webcontrol.
   */
  webcontrol_port: number = 8080;

  /**
   * Restrict webcontrol connections to the localhost.
   */
  webcontrol_localhost: string = 'on';

  /**
   * Type of configuration options to allow via the webcontrol.
   */
  webcontrol_parms: number = 0;

  /**
   * The port number for the live stream.
   */
  stream_port: number = 8081;

  /**
   * Restrict stream connections to the localhost.
   */
  stream_localhost: string = 'on';

  /**

   */
  '; camera'?: string = '/etc/motion/camera4.conf';

  /**

   */
  '; camera_dir'?: string = '/etc/motion/conf.d';

  [k: string]: string | number | undefined;
}
