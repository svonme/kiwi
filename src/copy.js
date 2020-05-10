"use strict";
/**
 * @file 复制中文到其它文案
 * @author svon.me@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
var path = require('path');
var mkdir = require('./mkdir');
var common = require("./common");
var childProcess = require('child_process');
function copyFile(langsDir, fileName) {
    var source = path.join(langsDir, common.Langs.zhCn, fileName);
    // 复制中文文案到其它语言下
    var keys = Object.keys(common.Langs);
    for (var _i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
        var key = keys_1[_i];
        var langName = common.Langs[key];
        if (langName !== common.Langs.zhCn) {
            var folder = path.join(langsDir, langName);
            // 判断文件夹是否存在，不存在则创建
            mkdir(folder);
            // 复制文件
            var target = path.join(folder, fileName);
            var shell = "cp " + source + " " + target;
            childProcess.exec(shell);
        }
    }
}
function Copy(langsDir) {
    // 获取中文下的所有文案
    var files = common.getFiles(langsDir, common.Langs.zhCn);
    // 循环复制到其它语言下
    for (var i = 0, len = files.length; i < len; i++) {
        copyFile(langsDir, files[i]);
    }
}
exports.default = Copy;
