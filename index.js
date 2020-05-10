/**
 * @file kiwi translate
 * @author svon.me@gmail.com
 */

var fs = require('fs');
var path = require('path');
var KiwiTtranslat = require('./src/main');
var getDirectory = require('@fengqiaogang/project-directory');

/**
 * 翻译
 * @param {*} accessKeyId       
 * @param {*} accessKeySecret 
 */
function Kiwi(accessKeyId, accessKeySecret) {
  var config = {}
  var directory = getDirectory();
  // 处理 access 信息
  if (accessKeyId && accessKeySecret) {
    config['id'] = accessKeyId;
    config['secret'] = accessKeySecret;
  } else {
    var src = path.join(directory, 'config.json');
    if (fs.existsSync(src)) {
      var option = require(src);
      if (option.accessKeyId && option.accessKeySecret) {
        config['id'] = option.accessKeyId;
        config['secret'] = option.accessKeySecret;
      } else if(option.translate.accessKeyId && option.translate.accessKeySecret){
        var data = option.translate;
        config['id'] = data.accessKeyId;
        config['secret'] = data.accessKeySecret;
      } else {
        console.log(1)
        throw new Error('accessKeyId and accessKeySecret cannot be empty');
      }
    }
  }
  var langsDir = path.join(directory, 'langs');
  if (fs.existsSync(langsDir)) {
    return new KiwiTtranslat(langsDir, config.accessKeyId, config.accessKeySecret);
  } else {
    var message = "'"+ langsDir + "'" + ' cannot be empty';
    throw new Error(message);
  }
}

Kiwi()

module.exports = Kiwi;
