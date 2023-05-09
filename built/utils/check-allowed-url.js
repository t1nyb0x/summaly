"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllowedUrl = void 0;
const PrivateIp = require('private-ip');
function checkAllowedUrl(url) {
    try {
        if (url == null)
            return false;
        const u = typeof url === 'string' ? new URL(url) : url;
        // procotol
        if (!u.protocol.match(/^https?:$/)) {
            return false;
        }
        // non dot host
        if (!u.hostname.includes('.')) {
            return false;
        }
        // port
        if (u.port !== '' && !['80', '443'].includes(u.port)) {
            return false;
        }
        // private address
        if (PrivateIp(u.hostname)) {
            return false;
        }
        // has auth
        if (u.username || u.password) {
            return false;
        }
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.checkAllowedUrl = checkAllowedUrl;
