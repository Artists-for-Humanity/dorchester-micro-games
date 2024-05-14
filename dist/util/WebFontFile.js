"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const phaser_1 = require("phaser");
const webfontloader_1 = require("webfontloader");
class WebFontFile extends phaser_1.default.Loader.File {
    constructor(loader, fontNames, service = 'google') {
        super(loader, {
            type: 'webfont',
            key: fontNames.toString()
        });
        this.fontNames = Array.isArray(fontNames) ? fontNames : [fontNames];
        this.service = service;
    }
    load() {
        const config = {
            active: () => {
                this.loader.nextFile(this, true);
            }
        };
        switch (this.service) {
            case 'google':
                config['google'] = {
                    families: this.fontNames
                };
                break;
            default:
                throw new Error('Unsupported font service');
        }
        webfontloader_1.default.load(config);
    }
}
exports.default = WebFontFile;
