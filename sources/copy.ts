/**
 * @file 复制中文到其它文案
 * @author svon.me@gmail.com
 */

const path = require('path');
const mkdir = require('./mkdir');
import * as common from './common';
const childProcess = require('child_process');

function copyFile(langsDir: string, fileName: string) {
  const source = path.join(langsDir, common.Langs.zhCn, fileName);
  // 复制中文文案到其它语言下
  const keys = Object.keys(common.Langs)
  for (const key of keys) {
    const langName = common.Langs[key];
    if (langName !== common.Langs.zhCn) {
      const folder = path.join(langsDir, langName);
      // 判断文件夹是否存在，不存在则创建
      mkdir(folder);
      // 复制文件
      const target = path.join(folder, fileName);
      const shell = `cp ${source} ${target}`;
      childProcess.exec(shell);
    }
  }
}

export default function Copy(langsDir: string) {
  // 获取中文下的所有文案
  const files = common.getFiles(langsDir, common.Langs.zhCn);
  // 循环复制到其它语言下
  for(let i = 0, len = files.length; i < len; i++) {
    copyFile(langsDir, files[i]);
  }
}
