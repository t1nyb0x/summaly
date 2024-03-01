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
const general_1 = require("../general");
const status_error_1 = require("../utils/status-error");
function test(url) {
    return url.hostname === 'www.dlsite.com';
}
exports.test = test;
function process(url) {
    return __awaiter(this, void 0, void 0, function* () {
        const summaly = yield (0, general_1.default)(url).catch(e => {
            if (e instanceof status_error_1.StatusError && e.statusCode === 404) {
                let pathname;
                if (url.pathname.match(/^[/]\w+[/]announce[/]/)) {
                    pathname = url.pathname.replace('/announce/', '/work/');
                }
                else if (url.pathname.match(/^[/]\w+[/]work[/]/)) {
                    pathname = url.pathname.replace('/work/', '/announce/');
                }
                else {
                    throw e;
                }
                const u = new URL(url);
                u.pathname = pathname;
                return (0, general_1.default)(u);
            }
            throw e;
        });
        const landingUrl = summaly.url;
        if (!landingUrl.match(/[/](?:home|comic|soft|app|ai)[/]/))
            summaly.sensitive = true;
        return summaly;
    });
}
exports.process = process;
