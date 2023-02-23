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
exports.postProcess = exports.isImageObject = exports.test = void 0;
function test(url) {
    return /^nijie[.]info$/.test(url.hostname);
}
exports.test = test;
const isImageObject = (object) => object['@type'] === 'ImageObject';
exports.isImageObject = isImageObject;
function postProcess(summaly) {
    return __awaiter(this, void 0, void 0, function* () {
        const landingUrl = summaly.url;
        const m = landingUrl.match(/nijie[.]info[/]view[.]php/);
        if (m && summaly.$) {
            try {
                const $ = summaly.$;
                const lds = [];
                const ele = $('script[type="application/ld+json"]');
                ele.each(function () {
                    // 改行がそのまま入っていることがあるのでデコード前にエスケープが必要
                    const text = $(this).text().replace(/\r?\n/g, '\\n');
                    lds.push(JSON.parse(text));
                });
                const io = lds.filter(exports.isImageObject)[0];
                if (io === null || io === void 0 ? void 0 : io.thumbnailUrl) {
                    summaly.thumbnail = io.thumbnailUrl;
                    summaly.sensitive = true;
                }
            }
            catch (e) {
                console.log(`Error in nijie ${e}`);
            }
        }
        return summaly;
    });
}
exports.postProcess = postProcess;
