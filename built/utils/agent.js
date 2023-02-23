"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.agent = exports.httpsAgent = exports.httpAgent = void 0;
const http = require("http");
const https = require("https");
exports.httpAgent = new http.Agent({
    keepAlive: true,
    keepAliveMsecs: 30 * 1000,
});
exports.httpsAgent = new https.Agent({
    keepAlive: true,
    keepAliveMsecs: 30 * 1000,
});
exports.agent = {
    http: exports.httpAgent,
    https: exports.httpsAgent,
};
