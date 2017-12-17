import {writeFileSync} from 'fs';
import * as G from 'glob';
import * as moment from 'moment';
import {createTransport} from 'nodemailer';
import {basename, join} from 'path';

const config = require(join(__dirname, '..', 'config', 'config.json'));

const transporter = createTransport({
  auth: {
    pass: config.smtp.pass,
    user: config.smtp.user
  },
  host: 'smtp.gmail.com',
  secure: true
});

transporter.verify((err) => {
  if (err) {
    console.error(err);
  }
});

setTimeout(() => {
  const now = moment();

  const start = moment(now).subtract(20, 'seconds');
  const end = moment(now).add(10, 'seconds');

  const glob = join(__dirname, '..', 'database', 'images') +
    '/@(' + start.format('YYYYMMDD-HHmmss').substr(0, 14) +
    '|' + now.format('YYYYMMDD-HHmmss').substr(0, 14) +
    '|' + end.format('YYYYMMDD-HHmmss').substr(0, 14) + ')*.jpg';

  G(glob, {}, (err, files) => {
    if (files.length > 20) {
      files = files.slice(files.length - 20, files.length - 1);
    }

    if (files.length === 0) {
      return;
    }

    const message = {
      attachments: files.map((file) => {
        return {
          filename: basename(file),
          path: file
        };
      }),
      from: config.smtp.user,
      subject: '[Motion] ' + now.toISOString(),
      text: JSON.stringify(files, null, 2),
      to: config.allowedEmails
    };

    transporter.sendMail(message, (sendErr, info) => {
      if (sendErr) {
        console.error(sendErr);
      }

      console.log(info);
    });

    writeFileSync(
      join(
        __dirname,
        '..',
        'database',
        'events',
        (new Date()).getTime().toString()
      ),
      JSON.stringify(files));
  });
}, 10000);
