"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAllowedUrl = void 0;
function checkAllowedUrl(url) {
    try {
        if (url == null)
            return false;
        const u = typeof url === 'string' ? new URL(url) : url;
        if (!u.protocol.match(/^https?:$/) || u.hostname === 'unix') {
            return false;
        }
        if (u.port !== '' && !['80', '443'].includes(u.port)) {
            return false;
        }
        return true;
    }
    catch (_a) {
        return false;
    }
}
exports.checkAllowedUrl = checkAllowedUrl;
