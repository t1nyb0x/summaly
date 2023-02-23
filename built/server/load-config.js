"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const yaml = require("js-yaml");
function default_1() {
    const path = `${__dirname}/../../server_config.yml`;
    try {
        const config = yaml.load((0, fs_1.readFileSync)(path, 'utf-8'));
        return config;
    }
    catch (_a) {
        return {};
    }
}
exports.default = default_1;
