"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.process = exports.test = void 0;
const got_1 = require("../utils/got");
const cheerio = require("cheerio");
const general_1 = require("../general");
function test(url) {
    if (url.hostname === 'open.spotify.com' || url.hostname === 'spotify.link' || url.hostname === 'spotify.app.link') {
        return true;
    }
    return false;
}
exports.test = test;
function process(url) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c;
        // get summary
        const originalUrl = new URL(url.href);
        if (url.hostname === 'spotify.link')
            url.hostname = 'spotify.app.link';
        const summary = yield (0, general_1.default)(url);
        originalUrl.href = summary.url;
        // build oEmbed url
        const oEmbedUrl = new URL('https://open.spotify.com/oembed');
        oEmbedUrl.searchParams.append('url', originalUrl.href);
        // get oEmbed
        const oEmbedResponse = yield (0, got_1.getJson)(oEmbedUrl.href, 'https://spotify.com');
        // parse
        const $ = cheerio.load(oEmbedResponse.html);
        const playerUrl = $('iframe').attr('src');
        if (!(playerUrl === null || playerUrl === void 0 ? void 0 : playerUrl.match(/^https?:\/\//)))
            throw 'Invalid player URL';
        return {
            title: (_a = oEmbedResponse.title) !== null && _a !== void 0 ? _a : null,
            description: summary.description,
            icon: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png',
            sitename: (_b = oEmbedResponse.provider_name) !== null && _b !== void 0 ? _b : null,
            thumbnail: (_c = oEmbedResponse.thumbnail_url) !== null && _c !== void 0 ? _c : null,
            player: {
                url: playerUrl,
                width: oEmbedResponse.width,
                height: oEmbedResponse.height,
            },
            url: originalUrl.href,
        };
    });
}
exports.process = process;
