import {createHash} from 'crypto';
import {readFileSync, writeFileSync} from 'fs';
import * as G from 'glob';
import * as moment from 'moment';
import {createTransport} from 'nodemailer';
import {basename, join} from 'path';

// read config
const config = JSON.parse(readFileSync(join(__dirname, '..', 'config', 'config.json')).toString());

// create transport
const transporter = createTransport({
  auth: {
    pass: config.smtp.pass,
    user: config.smtp.user,
  },
  host: 'smtp.gmail.com',
  secure: true,
});

// verify the transport
transporter.verify((err) => {
  if (err) {
    throw err;
  }
});

/**
 * Calculate md5 hash of something
 * @param content Something to calculate md5 hash for
 */
function md5(content: string): string {
  const hash = createHash('md5');
  hash.update(content);
  return hash.digest('hex').toString();
}

setTimeout(() => {
  const now = moment('2017-12-17T22:05:40');
  const start = moment(now).subtract(20, 'seconds');
  const iterator = moment(start);

  let glob = join(__dirname, '..', 'database', 'images')
    + '/@(' + start.format('YYYYMMDD-HHmmss').substr(0, 14);

  for (let i = 0; i < 4; i++) {
    iterator.add(10, 'seconds');
    glob += '|' + iterator.format('YYYYMMDD-HHmmss').substr(0, 14);
  }

  glob += ')*.jpg';

  console.log(now.toISOString(), start.toISOString(), iterator.toISOString(), glob);

  G(glob, {}, (err, files) => {
    if (err) {
      throw err;
    }

    if (files.length > 30) {
      files = files.slice(files.length - 30, files.length - 1);
    }

    if (files.length === 0) {
      console.info('No images to send.');
      return;
    }

    const message = {
      attachments: files.map((file) => {
        return {
          cid: md5(file),
          filename: basename(file),
          path: file,
        };
      }),
      from: config.smtp.user,
      html: files.map((file) => {
        return `<img src="cid:${md5(file)}" width="100%"/>`;
      }).join('<br/>'),
      subject: '[Motion] ' + now.toLocaleString(),
      to: config.allowedEmails,
    };

    transporter.sendMail(message, (sendErr, info) => {
      if (sendErr) {
        throw sendErr;
      }

      console.log(info);
    });

    writeFileSync(
      join(
        __dirname,
        '..',
        'database',
        'events',
        now.format('X'),
      ),
      JSON.stringify(files.map((file) => basename(file))),
    );
  });
}, 10000);
