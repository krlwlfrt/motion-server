import * as commander from 'commander';
import {readFileSync} from 'fs';
import {resolve} from 'path';
import {MotionEvent} from './event';
import {install} from './install';
import {parse} from './parse';
import {Server} from './server';

commander
  .version(JSON.parse((readFileSync(resolve(__dirname, '..', 'package.json')).toString())).version);

commander
  .command('parse <path>')
  .action((path) => {
    parse(path);
  });

commander
  .command('start')
  .action(async () => {
    const server = new Server();
    await server.start();
  });

commander
  .command('event')
  .action(async () => {
    const event = await new MotionEvent();
    await event.invoke();
  });

commander
  .command('install')
  .action(async () => {
    await install();
  });

commander.parse(process.argv);
