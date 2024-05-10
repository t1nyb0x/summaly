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
const cleanup_title_1 = require("./utils/cleanup-title");
const decode_entities_1 = require("./utils/decode-entities");
const got_1 = require("./utils/got");
const cleanup_url_1 = require("./utils/cleanup-url");
exports.default = (url_1, ...args_1) => __awaiter(void 0, [url_1, ...args_1], void 0, function* (url, lang = null, useRange = false) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y, _z, _0, _1, _2, _3, _4, _5, _6, _7, _8;
    if (lang && !lang.match(/^[\w-]+(\s*,\s*[\w-]+)*$/))
        lang = null;
    if (url.host.indexOf('spotify.link') === 0 || url.host.indexOf('spotify.app.link') === 0) {
        const res = yield (0, got_1.scpaping)(url.href, { lang: lang || undefined, useRange });
        const $ = res.$;
        if (!$)
            throw new Error('unex 1');
        // spotify.link, spotify.app.linkのsecondary-actionにopen.spotify.comがあるので、後続のスクレイピング対象に置き換える
        let secondaryAction = $('a.secondary-action').attr('href');
        if (secondaryAction === undefined)
            secondaryAction = url.host;
        url.href = secondaryAction;
    }
    const res = yield (0, got_1.scpaping)(url.href, { lang: lang || undefined, useRange });
    const $ = res.$;
    const landingUrl = new URL(res.response.url);
    if (res.pdf) {
        const result = {
            title: (_a = res.pdf.title) !== null && _a !== void 0 ? _a : 'PDF Document',
            icon: `data:image/png;base64,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`,
            description: null,
            thumbnail: null,
            medias: undefined,
            player: {
                url: null,
                width: null,
                height: null
            },
            sitename: (_b = landingUrl.hostname) !== null && _b !== void 0 ? _b : null,
            sensitive: false,
            url: landingUrl.href,
            $,
        };
        return result;
    }
    if (!$)
        throw new Error('unex 1');
    const twitterCard = (_c = $('meta[name="twitter:card"]').attr('content')) !== null && _c !== void 0 ? _c : $('meta[property="twitter:card"]').attr('content');
    let title = (_g = (_f = (_e = (_d = $('meta[name="twitter:title"]').attr('content')) !== null && _d !== void 0 ? _d : $('meta[property="twitter:title"]').attr('content')) !== null && _e !== void 0 ? _e : $('meta[property="og:title"]').attr('content')) !== null && _f !== void 0 ? _f : $('title').text()) !== null && _g !== void 0 ? _g : null;
    title = (0, decode_entities_1.decodeEntities)(title, 300);
    let image = (_o = (_m = (_l = (_k = (_j = (_h = $('meta[name="twitter:image"]').attr('content')) !== null && _h !== void 0 ? _h : $('meta[property="twitter:image"]').attr('content')) !== null && _j !== void 0 ? _j : $('meta[property="og:image"]').attr('content')) !== null && _k !== void 0 ? _k : $('link[rel="image_src"]').attr('href')) !== null && _l !== void 0 ? _l : $('link[rel="apple-touch-icon"]').attr('href')) !== null && _m !== void 0 ? _m : $('link[rel="apple-touch-icon image_src"]').attr('href')) !== null && _o !== void 0 ? _o : null;
    image = (0, cleanup_url_1.cleanupUrl)(image, landingUrl.href);
    let playerUrl = (_t = (_s = (_r = (_q = (_p = (twitterCard !== 'summary_large_image' ? $('meta[name="twitter:player"]').attr('content') : null)) !== null && _p !== void 0 ? _p : (twitterCard !== 'summary_large_image' ? $('meta[property="twitter:player"]').attr('content') : null)) !== null && _q !== void 0 ? _q : $('meta[property="og:video"]').attr('content')) !== null && _r !== void 0 ? _r : $('meta[property="og:video:secure_url"]').attr('content')) !== null && _s !== void 0 ? _s : $('meta[property="og:video:url"]').attr('content')) !== null && _t !== void 0 ? _t : null;
    playerUrl = (0, cleanup_url_1.cleanupUrl)(playerUrl, landingUrl.href);
    const playerWidth = parseInt((_w = (_v = (_u = $('meta[name="twitter:player:width"]').attr('content')) !== null && _u !== void 0 ? _u : $('meta[property="twitter:player:width"]').attr('content')) !== null && _v !== void 0 ? _v : $('meta[property="og:video:width"]').attr('content')) !== null && _w !== void 0 ? _w : '');
    const playerHeight = parseInt((_z = (_y = (_x = $('meta[name="twitter:player:height"]').attr('content')) !== null && _x !== void 0 ? _x : $('meta[property="twitter:player:height"]').attr('content')) !== null && _y !== void 0 ? _y : $('meta[property="og:video:height"]').attr('content')) !== null && _z !== void 0 ? _z : '');
    let description = (_3 = (_2 = (_1 = (_0 = $('meta[name="twitter:description"]').attr('content')) !== null && _0 !== void 0 ? _0 : $('meta[property="twitter:description"]').attr('content')) !== null && _1 !== void 0 ? _1 : $('meta[property="og:description"]').attr('content')) !== null && _2 !== void 0 ? _2 : $('meta[name="description"]').attr('content')) !== null && _3 !== void 0 ? _3 : null;
    description = (0, decode_entities_1.decodeEntities)(description, 300);
    if (title === description) {
        description = null;
    }
    let siteName = (_6 = (_5 = (_4 = $('meta[property="og:site_name"]').attr('content')) !== null && _4 !== void 0 ? _4 : $('meta[name="application-name"]').attr('content')) !== null && _5 !== void 0 ? _5 : landingUrl.hostname) !== null && _6 !== void 0 ? _6 : null;
    siteName = (0, decode_entities_1.decodeEntities)(siteName, 300);
    const favicon = (_8 = (_7 = $('link[rel="shortcut icon"]').attr('href')) !== null && _7 !== void 0 ? _7 : $('link[rel="icon"]').attr('href')) !== null && _8 !== void 0 ? _8 : null;
    const icon = (0, cleanup_url_1.cleanupUrl)(favicon, landingUrl.href);
    const sensitive = $('.tweet').attr('data-possibly-sensitive') === 'true';
    // Clean up the title
    title = (0, cleanup_title_1.default)(title, siteName);
    if (title === '') {
        title = siteName;
    }
    const result = {
        title,
        icon,
        description,
        thumbnail: image,
        medias: image ? [image] : undefined,
        player: {
            url: playerUrl,
            width: Number.isNaN(playerWidth) ? null : playerWidth,
            height: Number.isNaN(playerHeight) ? null : playerHeight
        },
        sitename: siteName,
        sensitive,
        url: landingUrl.href,
        $,
    };
    return result;
});
