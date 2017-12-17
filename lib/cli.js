"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const fs_1 = require("fs");
const path_1 = require("path");
const process_1 = require("process");
commander.version(require(path_1.join(process_1.cwd(), 'package.json')))
    .option('-p, --path [path]', 'Path to distribution\'s motion conf')
    .parse(process.argv);
fs_1.readFile(commander.path, { encoding: 'utf8' }, (err, content) => {
    const settings = {};
    let gatheredDescription = [];
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
    fs_1.writeFile('src/types.settings.ts', definition, (writeErr) => {
        if (writeErr) {
            throw writeErr;
        }
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6Ii9ob21lL3d1bGZlcnQvcHJpdmF0ZS9tb3Rpb24vc2VydmVyL3NyYy8iLCJzb3VyY2VzIjpbImNsaS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLHVDQUF1QztBQUN2QywyQkFBdUM7QUFDdkMsK0JBQTBCO0FBQzFCLHFDQUE0QjtBQUU1QixTQUFTLENBQUMsT0FBTyxDQUFDLE9BQU8sQ0FBQyxXQUFJLENBQUMsYUFBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQztLQUNwRCxNQUFNLENBQUMsbUJBQW1CLEVBQUUscUNBQXFDLENBQUM7S0FDbEUsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztBQUV2QixhQUFRLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxFQUFDLFFBQVEsRUFBRSxNQUFNLEVBQUMsRUFBRSxDQUFDLEdBQUcsRUFBRSxPQUFPLEVBQUUsRUFBRTtJQUM1RCxNQUFNLFFBQVEsR0FBaUYsRUFBRSxDQUFDO0lBQ2xHLElBQUksbUJBQW1CLEdBQWEsRUFBRSxDQUFDO0lBRXZDLE9BQU87U0FDSixLQUFLLENBQUMsSUFBSSxDQUFDO1NBQ1gsT0FBTyxDQUFDLENBQUMsSUFBSSxFQUFFLEVBQUU7UUFDaEIsRUFBRSxDQUFDLENBQUMsSUFBSSxLQUFLLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDaEIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM3QixtQkFBbUIsR0FBRyxFQUFFLENBQUM7WUFDekIsTUFBTSxDQUFDO1FBQ1QsQ0FBQztRQUVELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUM1QixtQkFBbUIsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8s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