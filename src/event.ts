import * as moment from 'moment';
import {createTransport} from 'nodemailer';
import {basename, join, resolve} from 'path';
import {eventsPath, globPromisified, hash, loadConfig, loadSettings, sleep, writeFilePromisified} from './common';

export class MotionEvent {
  config = loadConfig();
  settings = loadSettings();

  /**
   * Invoke the event
   */
  async invoke() {
    // create transport - has been verified on server startup
    const transporter = createTransport({
      auth: {
        pass: this.config.smtp.pass,
        user: this.config.smtp.user,
      },
      host: 'smtp.gmail.com',
      secure: true,
    });

    // @ts-ignore TODO
    await sleep(this.settings._eventDelay * 1000);

    const now = moment();
    // @ts-ignore TODO
    const start = moment(now).subtract(this.settings._eventDelay + 5, 'seconds');
    const iterator = moment(start);

    let glob = resolve(__dirname, '..', 'database', 'images')
      + '/@(' + start.format('YYYYMMDD-HHmmss').substr(0, 14);

    for (let i = 0; i < 4; i++) {
      iterator.add(10, 'seconds');
      glob += '|' + iterator.format('YYYYMMDD-HHmmss').substr(0, 14);
    }

    glob += ')*.jpg';

    console.log(now.toISOString(), start.toISOString(), iterator.toISOString(), glob);

    const files = await globPromisified(glob);

    if (files.length === 0) {
      console.info('No images to send.');
      return;
    }

    // copy list of files
    let filesToSend = files.slice();

    // @ts-ignore TODO
    if (filesToSend.length > this.settings._numberOfImages) {
      // @ts-ignore TODO
      filesToSend = filesToSend.slice(filesToSend.length - this.settings._numberOfImages);
    }

    // compile message
    const message = {
      attachments: filesToSend.map((file) => {
        return {
          cid: hash(file),
          filename: basename(file),
          path: file,
        };
      }),
      from: this.config.smtp.user,
      html: filesToSend.map((file) => {
        return `<img src="cid:${hash(file)}" width="100%" alt="${basename(file)}"/>`;
      }).join('<br/>'),
      subject: '[Motion] ' + now.toLocaleString(),
      to: this.config.allowedEmails,
    };

    const results = await Promise.all([
      transporter.sendMail(message),
      writeFilePromisified(join(eventsPath, now.format('X')), JSON.stringify(files.map((file) => basename(file)))),
    ]);

    console.info(results[0]);
  }
}
