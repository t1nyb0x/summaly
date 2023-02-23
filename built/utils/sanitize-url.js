"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sanitizeUrl = void 0;
function sanitizeUrl(str) {
    if (str == null)
        return str;
    try {
        const u = new URL(str);
        if (u.protocol === 'https:')
            return str;
        if (u.protocol === 'http:')
            return str;
    }
    catch (_a) {
        return null;
    }
    return null;
}
exports.sanitizeUrl = sanitizeUrl;
