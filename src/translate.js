"use strict";
/**
 * @file 文案翻译
 * @author svon.me@gmail.com
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require('lodash');
var fs = require('fs');
var path = require('path');
var recursion = require("@fengqiaogang/recursion");
var getDirectory = require('@fengqiaogang/project-directory');
var translate_1 = require("@quclouds/translate");
var langs = require("./langs");
var common = require("./common");
var copy_1 = require("./copy");
var Kiwi = /** @class */ (function () {
    function Kiwi(langsDir, id, secret) {
        var config = {
            accessKeyId: id,
            accessKeySecret: secret
        };
        this.config = config;
        if (langsDir) {
            this.langsDir = langsDir;
        }
        else {
            var directory = getDirectory();
            var src = path.join(directory, 'langs');
            if (fs.existsSync(src)) {
                this.langsDir = src;
            }
            else {
                throw new Error('langs cannot be empty');
            }
        }
        // 复制中文文案到其它语言下
        copy_1.default(this.langsDir);
    }
    Kiwi.prototype.getClient = function () {
        var config = this.config;
        return new translate_1.default(config.accessKeyId, config.accessKeySecret, "all");
    };
    /**
     * 获取缓存的文案
     * @param langName 缓存的语言
     */
    Kiwi.prototype.getCacheWords = function (langName) {
        // 缓存目录
        var dir = path.join(this.langsDir, "text_" + langName + ".json");
        // 读取已翻译文案
        return langs.getWords(dir);
    };
    /**
     * 翻译任务
     * @param target 目标语言
     * @param text   需要翻译的文案
     */
    Kiwi.prototype.createTranslateTask = function (target, text) {
        return __awaiter(this, void 0, void 0, function () {
            var cleant, language, source, result;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cleant = this.getClient();
                        language = common.translate[target];
                        source = common.translate[common.Langs.zhCn];
                        if (!language) return [3 /*break*/, 2];
                        return [4 /*yield*/, Promise.resolve(cleant.translate(language, text, source))];
                    case 1:
                        result = _a.sent();
                        if (result.success) {
                            return [2 /*return*/, result.data];
                        }
                        return [2 /*return*/, Promise.reject(result)];
                    case 2: return [2 /*return*/, Promise.reject(new Error('Target language error of translate'))];
                }
            });
        });
    };
    /**
     * 创建文案
     * @param langName 翻译的语言
     * @param key      文案的建值
     * @param text     文案内容
     */
    Kiwi.prototype.makeWord = function (langName, key, text) {
        return __awaiter(this, void 0, void 0, function () {
            var cache, value, error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        cache = this.getCacheWords(langName);
                        // 查询缓存
                        if (key in cache) {
                            return [2 /*return*/, {
                                    key: key,
                                    text: cache[key]
                                }];
                        }
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, this.createTranslateTask(langName, text)];
                    case 2:
                        value = _a.sent();
                        // 返回翻译后的结果
                        return [2 /*return*/, {
                                key: key,
                                text: value
                            }];
                    case 3:
                        error_1 = _a.sent();
                        // todo
                        console.error(error_1);
                        return [3 /*break*/, 4];
                    case 4: 
                    // 原文返回
                    return [2 /*return*/, { key: key, text: text }];
                }
            });
        });
    };
    /**
     * 创建文件的翻译文案
     * @param langName 翻译的语言
     * @param fileName 翻译的文件名称
     */
    Kiwi.prototype.createWordsTask = function (langName, fileName) {
        return __awaiter(this, void 0, void 0, function () {
            var dir, words, qps, time, callback, result, data, i, len, item;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        dir = path.join(this.langsDir, langName, fileName);
                        words = langs.getWords(dir);
                        qps = 20;
                        time = 1000;
                        callback = function (key) {
                            var text = words[key];
                            return _this.makeWord(langName, key, text);
                        };
                        return [4 /*yield*/, recursion(Object.keys(words), qps, time, callback)];
                    case 1:
                        result = _a.sent();
                        data = {};
                        for (i = 0, len = result.length; i < len; i++) {
                            item = result[i];
                            data[item.key] = item.text;
                        }
                        return [2 /*return*/, data];
                }
            });
        });
    };
    Kiwi.prototype.writeFile = function (langName, fileName, data) {
        var file = {};
        for (var key in data) {
            var value = data[key];
            _.setWith(file, key, value, Object);
        }
        var fileJSON = JSON.stringify(file, null, 2);
        var fileContent = "export default " + fileJSON;
        var src = path.join(this.langsDir, langName, fileName);
        var error = fs.writeFileSync(src, fileContent);
        if (error) {
            throw error;
        }
        console.log(src);
    };
    /**
     * 创建翻译任务
     * @param langName 翻译的语言
     * @param files    翻译的所有文件
     */
    Kiwi.prototype.createFilesTask = function (langName, files) {
        var _this = this;
        var qps = 1;
        var time = 1000;
        var callback = function (fileName) { return __awaiter(_this, void 0, void 0, function () {
            var data, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.createWordsTask(langName, fileName)];
                    case 1:
                        data = _a.sent();
                        try {
                            this.writeFile(langName, fileName, data);
                        }
                        catch (error) {
                            // todo
                        }
                        return [3 /*break*/, 3];
                    case 2:
                        error_2 = _a.sent();
                        return [3 /*break*/, 3];
                    case 3: return [2 /*return*/];
                }
            });
        }); };
        return recursion(files, qps, time, callback);
    };
    Kiwi.prototype.translate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var timeName, keys, files, tasks, _i, keys_1, key, langName;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        timeName = 'translate';
                        console.time(timeName);
                        keys = Object.keys(common.Langs);
                        files = langs.getFiles(this.langsDir);
                        tasks = [];
                        for (_i = 0, keys_1 = keys; _i < keys_1.length; _i++) {
                            key = keys_1[_i];
                            langName = common.Langs[key];
                            if (langName !== common.Langs.zhCn) {
                                tasks.push(this.createFilesTask(langName, files));
                            }
                        }
                        return [4 /*yield*/, Promise.all(tasks)];
                    case 1:
                        _a.sent();
                        console.timeEnd(timeName);
                        return [2 /*return*/];
                }
            });
        });
    };
    return Kiwi;
}());
module.exports = Kiwi;
