"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripEx = void 0;
function StripEx(ex) {
    return {
        description: ex.description,
        icon: ex.icon,
        sitename: ex.sitename,
        thumbnail: ex.thumbnail,
        player: ex.player,
        title: ex.title,
        sensitive: ex.sensitive,
        url: ex.url,
    };
}
exports.StripEx = StripEx;
