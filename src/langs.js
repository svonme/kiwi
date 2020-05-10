"use strict";
/**
 * @file 获取 Langs 目录
 * @author svon.me@gmail.com
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require('fs');
const path = require('path');
const common = require("./common");
/**
 * 与 common getFiles 功能相同，区别在于排除 index.ts 文件
 * @param dir  文案目录
 */
function getFiles(dir) {
    const files = common.getFiles(dir, common.Langs.zhCn);
    return files.filter(name => name !== 'index.ts');
}
exports.getFiles = getFiles;
/**
 * 散开键值对数据
 * @param prefix
 * @param data
 */
function splitJoin(prefix, data) {
    const map = {};
    function app(name, result) {
        for (let key in result) {
            const value = result[key];
            if (typeof value === 'object') {
                app(`${name}.${key}`, value);
            }
            else {
                map[`${name}.${key}`] = value;
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
        const item = require(fileDir);
        const fileName = path.basename(fileDir);
        let name;
        if (fileName.lastIndexOf('.') > 0) {
            name = fileName.slice(0, fileName.lastIndexOf('.'));
        }
        else {
            name = fileName;
        }
        if (item && item.default) {
            return splitJoin(name, item.default);
        }
        else {
            return splitJoin(name, item);
        }
    }
    return {};
}
exports.getWords = getWords;
