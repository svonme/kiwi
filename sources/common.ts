/**
 * @file 公共信息
 * @author svon.me@gmail.com
 */

const fs = require('fs');
const path = require('path');

export enum Langs {
  enUs = "en_US",
  zhCn = "zh_CN",
  zhTW = "zh_TW"
}

export enum translate {
  ["en_US"] = "en",
  ["zh_CN"] = "zh",
  ["zh_TW"] = "zh-tw",
}

export type Language = "en_US" | "zh_CN" | "zh_TW";

export interface Word {
  [key: string]: string;
}

export function getFiles(langsDir: string, langName: Language): string[] {
  // 获取语言下的所有文案
  const src = path.join(langsDir, langName);
  const files = fs.readdirSync(src);
  const list = [].concat(files);
  const names: string[] = [];
  for(let i = 0, len = list.length; i < len; i++) {
    const name = list[i];
    if (name) {
      names.push(name)
    }
  }
  return names;
}