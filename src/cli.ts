import * as commander from 'commander';
import {readFile, writeFile} from 'fs';
import {join} from 'path';
import {cwd} from 'process';

commander.version(require(join(cwd(), 'package.json')))
  .option('-p, --path [path]', 'Path to distribution\'s motion conf')
  .parse(process.argv);

readFile(commander.path, {encoding: 'utf8'}, (err, content) => {
  const settings: { [s: string]: { description: string[]; value: string; optional: boolean } } = {};
  let gatheredDescription: string[] = [];

  content
    .split('\n')
    .forEach((line) => {
      if (line === '') {
        return;
      }

      if (line.indexOf('##') === 0) {
        gatheredDescription = [];
        return;
      }

      if (line.indexOf('#') === 0) {
        gatheredDescription.push(line.replace(/^#\s?/, ''));
        return;
      }

      let optional = false;
      if (line.indexOf(';') === 0) {
        line = line.replace(/^;\s?/, '');
        optional = true;
      }

      line = line.trim();
      const parts = line.split(' ');
      const setting = parts[0];

      parts.splice(0, 1);
      const value = parts.join(' ');

      settings[setting] = {
        description: gatheredDescription,
        optional: optional,
        value: value
      };

      gatheredDescription = [];
    });

  let definition = '/* tslint:disable */\nexport class MotionSettings {\n';
  Object.keys(settings).forEach((key) => {
    const setting = settings[key];

    let type = 'number';
    let value = setting.value;
    if (!setting.value.match(/^[0-9]+$/)) {
      type = 'string';
      value = '\'' + value.replace(/\'/g, '\\\'') + '\'';
    }

    definition += '  /**\n'
      + setting.description.map((line) => {
        return '   * ' + line;
      }).join('\n')
      + '\n   */\n'
      + '  '
      + ((setting.optional) ? '\'; ' + key + '\'?' : key)
      + ': '
      + type
      + ' = '
      + value
      + ';\n\n';
  });
  definition += '}\n';

  writeFile('src/types.settings.ts', definition, (writeErr) => {
    if (writeErr) {
      throw writeErr;
    }
  });
});
