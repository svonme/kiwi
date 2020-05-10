"use strict";
/**
 * @file 公共信息
 * @author svon.me@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
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
    var src = path.join(langsDir, langName);
    var files = fs.readdirSync(src);
    var list = [].concat(files);
    var names = [];
    for (var i = 0, len = list.length; i < len; i++) {
        var name_1 = list[i];
        if (name_1) {
            names.push(name_1);
        }
    }
    return names;
}
exports.getFiles = getFiles;
