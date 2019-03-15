import {render} from 'mustache';
import {resolve} from 'path';
import {exec} from 'shelljs';
import {readFilePromisified, writeFilePromisified} from './common';

export async function install() {
  exec('systemctl disable motion-event');
  exec('systemctl disable motion-server');

  console.info('Disabled existing services.');

  const buffers = await Promise.all([
    readFilePromisified(resolve(__dirname, '..', 'systemd', 'templates', 'motion-event.service.mustache')),
    readFilePromisified(resolve(__dirname, '..', 'systemd', 'templates', 'motion-server.service.mustache')),
  ]);

  const eventTemplate = buffers[0].toString();
  const serverTemplate = buffers[1].toString();

  console.info('Read templates.');

  const data = {
    path: resolve(__dirname, '..'),
  };

  const eventService = resolve(__dirname, '..', 'systemd', 'motion-event.service');
  const serverService = resolve(__dirname, '..', 'systemd', 'motion-server.service');

  await Promise.all([
    writeFilePromisified(eventService, render(eventTemplate, data)),
    writeFilePromisified(serverService, render(serverTemplate, data)),
  ]);

  console.info('Wrote templates.');

  exec(`systemctl link ${eventService}`);
  exec(`systemctl link ${serverService}`);
  exec(`systemctl enable --now ${serverService}`);
}
