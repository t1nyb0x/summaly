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
const decode_entities_1 = require("../utils/decode-entities");
function test(url) {
    return /^(?:www|ecchi)[.]iwara[.]tv$/.test(url.hostname);
}
exports.test = test;
function postProcess(summaly) {
    return __awaiter(this, void 0, void 0, function* () {
        const landingUrl = summaly.url;
        //#region description
        if (summaly.description == null && summaly.$) {
            let description = summaly.$('.field-type-text-with-summary').text() || null;
            description = (0, decode_entities_1.decodeEntities)(description, 500);
            if (description !== summaly.title) {
                summaly.description = description;
            }
        }
        //#endregion description
        //#region thumbnail
        if (summaly.thumbnail == null && summaly.$) {
            const thum = summaly.$('#video-player').first().attr('poster') ||
                summaly.$('.field-name-field-images a').first().attr('href') ||
                null;
            const thumbnail = thum ? new URL(thum, landingUrl).href : null;
            summaly.thumbnail = thumbnail;
        }
        //#endregion thumbnail
        if (landingUrl.match(/[/][/]ecchi[.]/))
            summaly.sensitive = true;
        return summaly;
    });
}
exports.postProcess = postProcess;
