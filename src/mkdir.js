/**
 * @file 文件夹创建
 * @author svon.me@gmail.com
 */
var fs = require("fs");
var path = require("path");
function mkdir(dirname) {
    if (fs.existsSync(dirname)) {
        return true;
    }
    else {
        if (mkdir(path.posix.dirname(dirname))) {
            fs.mkdirSync(dirname);
            return true;
        }
    }
}
module.exports = mkdir;
