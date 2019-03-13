"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander = require("commander");
const fs_1 = require("fs");
const path_1 = require("path");
const process_1 = require("process");
commander.version(fs_1.readFileSync(path_1.join(process_1.cwd(), 'package.json')).toString().version)
    .option('-p, --path [path]', 'Path to distribution\'s motion conf')
    .parse(process.argv);
fs_1.readFile(commander.path, { encoding: 'utf8' }, (err, content) => {
    if (err) {
        throw err;
    }
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
            value: value,
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6Ii4vc3JjLyIsInNvdXJjZXMiOlsiY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7O0FBQUEsdUNBQXVDO0FBQ3ZDLDJCQUFxRDtBQUNyRCwrQkFBMEI7QUFDMUIscUNBQTRCO0FBRTVCLFNBQVMsQ0FBQyxPQUFPLENBQUUsaUJBQVksQ0FBQyxXQUFJLENBQUMsYUFBRyxFQUFFLEVBQUUsY0FBYyxDQUFDLENBQUMsQ0FBQyxRQUFRLEVBQVUsQ0FBQyxPQUFPLENBQUM7S0FDckYsTUFBTSxDQUFDLG1CQUFtQixFQUFFLHFDQUFxQyxDQUFDO0tBQ2xFLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7QUFFdkIsYUFBUSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEVBQUUsRUFBQyxRQUFRLEVBQUUsTUFBTSxFQUFDLEVBQUUsQ0FBQyxHQUFHLEVBQUUsT0FBTyxFQUFFLEVBQUU7SUFDNUQsSUFBSSxHQUFHLEVBQUU7UUFDUCxNQUFNLEdBQUcsQ0FBQztLQUNYO0lBRUQsTUFBTSxRQUFRLEdBQWtGLEVBQUUsQ0FBQztJQUNuRyxJQUFJLG1CQUFtQixHQUFhLEVBQUUsQ0FBQztJQUV2QyxPQUFPO1NBQ0osS0FBSyxDQUFDLElBQUksQ0FBQztTQUNYLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxFQUFFO1FBQ2hCLElBQUksSUFBSSxLQUFLLEVBQUUsRUFBRTtZQUNmLE9BQU87U0FDUjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDNUIsbUJBQW1CLEdBQUcsRUFBRSxDQUFDO1lBQ3pCLE9BQU87U0FDUjtRQUVELElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLEVBQUU7WUFDM0IsbUJBQW1CLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsT0FBTyxFQUFFLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDcEQsT0FB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