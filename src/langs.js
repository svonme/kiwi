"use strict";
/**
 * @file 获取 Langs 目录
 * @author svon.me@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var path = require('path');
var common = require("./common");
/**
 * 与 common getFiles 功能相同，区别在于排除 index.ts 文件
 * @param dir  文案目录
 */
function getFiles(dir) {
    var files = common.getFiles(dir, common.Langs.zhCn);
    return files.filter(function (name) { return name !== 'index.ts'; });
}
exports.getFiles = getFiles;
/**
 * 散开键值对数据
 * @param prefix
 * @param data
 */
function splitJoin(prefix, data) {
    var map = {};
    function app(name, result) {
        for (var key in result) {
            var value = result[key];
            if (typeof value === 'object') {
                app(name + "." + key, value);
            }
            else {
                map[name + "." + key] = value;
            }
        }
    }
    app(prefix, data);
    return map;
}
/**
 * 获取文案
 * @param fileDir
 */
function getWords(fileDir) {
    if (fs.existsSync(fileDir)) {
        var item = require(fileDir);
        var fileName = path.basename(fileDir);
        var name_1;
        if (fileName.lastIndexOf('.') > 0) {
            name_1 = fileName.slice(0, fileName.lastIndexOf('.'));
        }
        else {
            name_1 = fileName;
        }
        if (item && item.default) {
            return splitJoin(name_1, item.default);
        }
        else {
            return splitJoin(name_1, item);
        }
    }
    return {};
}
exports.getWords = getWords;
