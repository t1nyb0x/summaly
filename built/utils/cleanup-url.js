"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cleanupUrl = void 0;
/**
 * To absolute and sanitize URL
 * @param url URL (absolute or relative)
 * @param base Base URL
 * @returns absolute URL
 */
function cleanupUrl(url, base) {
    if (url == null)
        return null;
    try {
        const u = new URL(url, base);
        if (u.protocol === 'https:')
            return u.href;
        if (u.protocol === 'http:')
            return u.href;
        // dataはこないということに
    }
    catch (_a) {
        return null;
    }
    return null;
}
exports.cleanupUrl = cleanupUrl;
