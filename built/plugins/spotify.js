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
const got_2 = require("../utils/got");
function test(url) {
    if (url.hostname === 'open.spotify.com' || url.hostname === 'spotify.link' || url.hostname === 'spotify.app.link') {
        return true;
    }
    return false;
}
exports.test = test;
function process(url_1) {
    return __awaiter(this, arguments, void 0, function* (url, lang = null, useRange = false) {
        var _a, _b, _c, _d;
        if (url.hostname.indexOf('spotify.link') === 0 || url.hostname.indexOf('spotify.app.link') === 0) {
            if (url.hostname === 'spotify.link') {
                url.hostname = 'spotify.app.link';
            }
            const scrapingResult = yield (0, got_2.scpaping)(url.href, { lang: lang || undefined, useRange });
            if (!scrapingResult.$) {
                throw new Error('Scraping failed');
            }
            let openSpotifyUrl = scrapingResult.$('a.secondary-action').attr('href');
            if (!openSpotifyUrl) {
                openSpotifyUrl = url.href;
            }
            url.href = openSpotifyUrl;
        }
        const oEmbedUrl = new URL('https://open.spotify.com/oembed');
        oEmbedUrl.searchParams.append('url', url.href);
        const oEmbedResponse = yield (0, got_1.getJson)(oEmbedUrl.href, 'https://spotify.com');
        const $ = cheerio.load(oEmbedResponse.html);
        const playerUrl = $('iframe').attr('src');
        if (!(playerUrl === null || playerUrl === void 0 ? void 0 : playerUrl.match(/^https?:\/\//)))
            throw 'Invalid player URL';
        return {
            title: (_a = oEmbedResponse.title) !== null && _a !== void 0 ? _a : null,
            description: (_b = oEmbedResponse.description) !== null && _b !== void 0 ? _b : null,
            icon: 'https://open.spotifycdn.com/cdn/images/favicon32.b64ecc03.png',
            sitename: (_c = oEmbedResponse.provider_name) !== null && _c !== void 0 ? _c : null,
            thumbnail: (_d = oEmbedResponse.thumbnail_url) !== null && _d !== void 0 ? _d : null,
            player: {
                url: playerUrl,
                width: oEmbedResponse.width,
                height: oEmbedResponse.height,
            },
            url: url.href,
        };
    });
}
exports.process = process;
