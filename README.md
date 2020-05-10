## @fengqiaogang/kiwi

对[ALibaba Kiwi-国际化全流程解决方案](https://github.com/alibaba/kiwi)进行简化，旨在方便使用
[ALibab kiwi-clis](https://www.npmjs.com/package/kiwi-clis)有一个快捷工具，里面的翻译原理是使用
Google translate 进行翻译，因网络原因在国内使用可能不太方便，这里的替代方案是使用[阿里机器翻译](https://help.aliyun.com/product/30396.html), 因此需要开通该服务，如果有其它代替方案则需要通过继承的方式重写该模块中的[createTranslateTask](#user-content-createTranslateTask)方法

**安装**
```
yarn add -D @fengqiaogang/kiwi kiwi-intl intl-format
or
npm install --save-dev @fengqiaogang/kiwi kiwi-intl intl-format
```

**配置**

在项目下创建 `langs/zh_CN`、`langs/zh_TW`、`langs/en_US` 目录

```
langs
  |- zh_CN
  |- zh_TW
  |- en_US
```

添加配置文件 config.json

```
{
  "translate": {
    "accessKeyId": "xxxx",
    "accessKeySecret": "xxxx"
  }
}
```

**使用方法**

```
const Kiwi = require("@fengqiaogang/kiwi");
const kiwi = Kiwi();
kiwi.translate();  // 执行翻译，会根据 langs/zh_CN 目录下的中文同步翻译其它语言
```

**Kiwi 方法介绍**

```
Kiwi(accessKeyId?: string, accessKeySecret?: string)
```
如果配置了 config.json 信息则 accessKeyId & accessKeySecret 两个参数可以为空，反之则必填

**关于生产代码中的I18N**

根据项目情况修改以下代码

```
import I18N from 'xxx/i18n';

const hello = I18N.xxx.hello;
```

i18n.js [点击查看使用方法](https://github.com/alibaba/kiwi)

```
const IntlFormat = require('intl-format');
const zhCNLangs = require('langs/zh_CN/');
const enUsLangs = require('langs/en_US/');
const zhTWLangs = require('langs/zh_TW/');

const LangEnum = {
  zh_CN: 'zh_CN',
  en_US: 'en_US',
  zh_TW: 'zh_TW',
}

/**
 * 获取当前语言的Cookie
 */
function getCurrentLang() {
  const urlLang = new URL(window.location.href).searchParams.get('lang');
  const cookieLang = (document.cookie.match(/es_lang=([^;$]+)/) || [null, 'zh_CN'])[1];
  const lang = cookieLang.split(' ')[0];
  if (Object.keys(LangEnum).includes(urlLang)) {
    return urlLang;
  }
  return lang ;
}

function setDefaultLang() {
  const lang = getCurrentLang();
  const cookieLocale = (document.cookie.match(/es_lang=([^;$]+)/) || [null, ''])[1];
  const cookieLang = cookieLocale.split(' ')[0];
  if (lang !== cookieLang) {
    document.cookie = `es_lang=${lang}; path=/`;
  }
}
/**
 * 首次访问时，获取默认语言
 */
setDefaultLang();

const langs = {
  zh_CN: zhCNLangs,
  en_US: enUsLangs,
  zh_TW: zhTWLangs,
};
// 从 Cookie 中取语言值, 默认为 zh_CN
const defaultLang = getCurrentLang();
let curLang;
if (Object.keys(langs).indexOf(defaultLang) > -1) {
  curLang = defaultLang;
} else {
  // 如果没有对应的语言文件, 置为中文
  curLang = 'zh_CN';
}
const intlFormat = IntlFormat.init(curLang, langs);
window.intlFormat = intlFormat;

module.exports = intlFormat;
```

**自定义翻译服务**
### createTranslateTask

```
class Kiwi extends KiwiTtranslat {
  /**
   * 翻译任务
   * @param target 目标语言
   * @param text   需要翻译的文案
   */
  createTranslateTask(target: common.Language, text: string): Promise<string> {
    // todo
    const value: string = '翻译结果';
    return value;
  }
}
```
