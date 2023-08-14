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
// 高速Twitterプラグイン
const got_1 = require("../utils/got");
function test(url) {
    return /^(?:twitter|x)\.com$/.test(url.hostname)
        && /^[/]\w+[/]status[/](\d+)/.test(url.pathname);
}
exports.test = test;
function process(url) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __awaiter(this, void 0, void 0, function* () {
        const m = url.pathname.match(/^[/]\w+[/]status[/](\d+)/);
        if (!m)
            throw 'err';
        const u = `https://cdn.syndication.twimg.com/tweet-result?id=${m[1]}&lang=en`;
        const j = yield (0, got_1.getJson)(u, 'https://platform.twitter.com/embed/index.html');
        let text = j.text || '';
        // 本文の添付メディアのt.co消し
        const tco0 = (_d = (_c = (_b = (_a = j.entities) === null || _a === void 0 ? void 0 : _a.media) === null || _b === void 0 ? void 0 : _b[0]) === null || _c === void 0 ? void 0 : _c.indices) === null || _d === void 0 ? void 0 : _d[0];
        if (typeof tco0 === 'number') {
            text = text === null || text === void 0 ? void 0 : text.substring(0, tco0).trimEnd();
        }
        return {
            description: text,
            icon: 'https://abs.twimg.com/favicons/twitter.3.ico',
            sitename: 'X',
            thumbnail: ((_e = j.video) === null || _e === void 0 ? void 0 : _e.poster) || ((_g = (_f = j.photos) === null || _f === void 0 ? void 0 : _f[0]) === null || _g === void 0 ? void 0 : _g.url) || (((_h = j.user) === null || _h === void 0 ? void 0 : _h.profile_image_url_https) ? (_j = j.user) === null || _j === void 0 ? void 0 : _j.profile_image_url_https.replace(/_normal\./, '.') : null) || null,
            player: {
                url: null,
                width: null,
                height: null,
            },
            title: `${(_k = j.user) === null || _k === void 0 ? void 0 : _k.name} on X`,
            sensitive: j.possibly_sensitive,
            url: url.href,
            medias: ((_l = j.photos) === null || _l === void 0 ? void 0 : _l.map(x => x.url)) || undefined,
        };
    });
}
exports.process = process;
