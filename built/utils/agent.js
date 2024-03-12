"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = exports.httpsAgent = exports.httpAgent = void 0;
const http = require("http");
const https = require("https");
const process_1 = require("process");
const family = process_1.env.SUMMALY_FAMILY == '4' ? 4 : process_1.env.SUMMALY_FAMILY == '6' ? 6 : undefined;
exports.httpAgent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 30 * 1000,
    family,
});
exports.httpsAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 30 * 1000,
    family,
});
exports.agent = {
    http: exports.httpAgent,
    https: exports.httpsAgent,
};
