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
exports.postProcess = exports.test = void 0;
const got_1 = require("../utils/got");
function test(url) {
    return /^komiflo[.]com$/.test(url.hostname);
}
exports.test = test;
function postProcess(summaly) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b, _c, _d, _e, _f, _g, _h;
        const landingUrl = summaly.url;
        // 作品ページ？
        const m = landingUrl.match(/komiflo[.]com(?:[/]#!)?[/]comics[/](\d+)/);
        if (m) {
            // 取得出来ていればそのまま
            if (!((_a = summaly.thumbnail) === null || _a === void 0 ? void 0 : _a.match(/favicon|ogp_logo/)))
                return summaly;
            const id = m[1];
            const apiUrl = `https://api.komiflo.com/content/id/${id}`;
            try {
                const json = (yield (0, got_1.getJson)(apiUrl, landingUrl));
                const named_imgs = ((_b = json === null || json === void 0 ? void 0 : json.content) === null || _b === void 0 ? void 0 : _b.named_imgs) || ((_e = (_d = (_c = json === null || json === void 0 ? void 0 : json.content) === null || _c === void 0 ? void 0 : _c.children) === null || _d === void 0 ? void 0 : _d[0]) === null || _e === void 0 ? void 0 : _e.named_imgs);
                if (((_f = named_imgs === null || named_imgs === void 0 ? void 0 : named_imgs.cover) === null || _f === void 0 ? void 0 : _f.filename) && ((_h = (_g = named_imgs === null || named_imgs === void 0 ? void 0 : named_imgs.cover) === null || _g === void 0 ? void 0 : _g.variants) === null || _h === void 0 ? void 0 : _h.includes('346_mobile'))) {
                    const thumbnail = 'https://t.komiflo.com/346_mobile/' + named_imgs.cover.filename;
                    summaly.thumbnail = thumbnail;
                    summaly.sensitive = true;
                }
            }
            catch (e) {
                console.log(`Error in komiflo ${e}`);
            }
        }
        return summaly;
    });
}
exports.postProcess = postProcess;
