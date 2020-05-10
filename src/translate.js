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
Object.defineProperty(exports, "__esModule", { value: true });
const _ = require('lodash');
const fs = require('fs');
const path = require('path');
const recursion = require("@fengqiaogang/recursion");
const getDirectory = require('@fengqiaogang/project-directory');
const translate_1 = require("@quclouds/translate");
const langs = require("./langs");
const common = require("./common");
const copy_1 = require("./copy");
console.log(process);
class Kiwi {
    constructor(langsDir, id, secret) {
        const config = {
            accessKeyId: id,
            accessKeySecret: secret
        };
        this.config = config;
        if (langsDir) {
            this.langsDir = langsDir;
        }
        else {
            const directory = getDirectory();
            const src = path.join(directory, 'langs');
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
    getClient() {
        const config = this.config;
        return new translate_1.default(config.accessKeyId, config.accessKeySecret, "all");
    }
    /**
     * 获取缓存的文案
     * @param langName 缓存的语言
     */
    getCacheWords(langName) {
        // 缓存目录
        const dir = path.join(this.langsDir, `text_${langName}.json`);
        // 读取已翻译文案
        return langs.getWords(dir);
    }
    /**
     * 翻译任务
     * @param target 目标语言
     * @param text   需要翻译的文案
     */
    createTranslateTask(target, text) {
        return __awaiter(this, void 0, void 0, function* () {
            const cleant = this.getClient();
            const language = common.translate[target];
            const source = common.translate[common.Langs.zhCn];
            if (language) {
                const result = yield Promise.resolve(cleant.translate(language, text, source));
                if (result.success) {
                    return result.data;
                }
                return Promise.reject(result);
            }
            return Promise.reject(new Error('Target language error of translate'));
        });
    }
    /**
     * 创建文案
     * @param langName 翻译的语言
     * @param key      文案的建值
     * @param text     文案内容
     */
    makeWord(langName, key, text) {
        return __awaiter(this, void 0, void 0, function* () {
            // 读取该语言的缓存文案
            const cache = this.getCacheWords(langName);
            // 查询缓存
            if (key in cache) {
                return {
                    key,
                    text: cache[key]
                };
            }
            try {
                // 调用翻译服务
                const value = yield this.createTranslateTask(langName, text);
                // 返回翻译后的结果
                return {
                    key,
                    text: value
                };
            }
            catch (error) {
                // todo
                console.error(error);
            }
            // 原文返回
            return { key, text };
        });
    }
    /**
     * 创建文件的翻译文案
     * @param langName 翻译的语言
     * @param fileName 翻译的文件名称
     */
    createWordsTask(langName, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            const dir = path.join(this.langsDir, langName, fileName);
            // 读取该文件中的所有文案
            const words = langs.getWords(dir);
            const qps = 20; // 每次翻译多少文案
            const time = 1000; // 每次执行间隔时间
            // 翻译单个文案
            const callback = (key) => {
                const text = words[key];
                return this.makeWord(langName, key, text);
            };
            const result = yield recursion(Object.keys(words), qps, time, callback);
            const data = {};
            for (let i = 0, len = result.length; i < len; i++) {
                const item = result[i];
                data[item.key] = item.text;
            }
            return data;
        });
    }
    writeFile(langName, fileName, data) {
        const file = {};
        for (let key in data) {
            const value = data[key];
            _.setWith(file, key, value, Object);
        }
        const fileJSON = JSON.stringify(file, null, 2);
        const fileContent = `export default ${fileJSON}`;
        const src = path.join(this.langsDir, langName, fileName);
        const error = fs.writeFileSync(src, fileContent);
        if (error) {
            throw error;
        }
    }
    /**
     * 创建翻译任务
     * @param langName 翻译的语言
     * @param files    翻译的所有文件
     */
    createFilesTask(langName, files) {
        const qps = 1;
        const time = 1000;
        const callback = (fileName) => __awaiter(this, void 0, void 0, function* () {
            try {
                // 翻译单个文件
                const data = yield this.createWordsTask(langName, fileName);
                try {
                    this.writeFile(langName, fileName, data);
                }
                catch (error) {
                    // todo
                }
            }
            catch (error) {
                // todo
            }
        });
        return recursion(files, qps, time, callback);
    }
    translate() {
        return __awaiter(this, void 0, void 0, function* () {
            const timeName = 'translate';
            console.time(timeName);
            // 复制中文文案到其它语言下
            const keys = Object.keys(common.Langs);
            const files = langs.getFiles(this.langsDir);
            const tasks = [];
            for (const key of keys) {
                const langName = common.Langs[key];
                if (langName !== common.Langs.zhCn) {
                    tasks.push(this.createFilesTask(langName, files));
                }
            }
            yield Promise.all(tasks);
            console.timeEnd(timeName);
        });
    }
}
module.exports = Kiwi;
