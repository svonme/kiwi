"use strict";
/**
 * @file 公共信息
 * @author svon.me@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
var Langs;
(function (Langs) {
    Langs["enUs"] = "en_US";
    Langs["zhCn"] = "zh_CN";
    Langs["zhTW"] = "zh_TW";
})(Langs = exports.Langs || (exports.Langs = {}));
var translate;
(function (translate) {
    translate["en_US"] = "en";
    translate["zh_CN"] = "zh";
    translate["zh_TW"] = "zh-tw";
})(translate = exports.translate || (exports.translate = {}));
function getFiles(langsDir, langName) {
    // 获取语言下的所有文案
    const src = path.join(langsDir, langName);
    const files = fs.readdirSync(src);
    const list = [].concat(files);
    const names = [];
    for (let i = 0, len = list.length; i < len; i++) {
        const name = list[i];
        if (name) {
            names.push(name);
        }
    }
    return names;
}
exports.getFiles = getFiles;
