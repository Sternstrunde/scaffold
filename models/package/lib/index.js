"use strict";

const { isObject } = require("@test-cli-dev/utils");

class Package {
  constructor(options) {
    // console.log("Package constructor");
    if (!options) {
      throw new Error("Package类的opitons参数不能为空！");
    }

    if (!isObject(options)) {
      throw new Error("Package类的opitons参数必须是对象！");
    }
    // package的路径
    this.targetPath = options.targetPath;

    // package的存储路径
    this.storePath = options.storePath;

    // package的name
    this.packageName = options.packageName;
    // package的version
    this.packgeVersion = options.packgeVersion;
  }

  // 判断当前Package是否存在
  exists() {}
  // 安装Packages
  install() {}

  // 更新Packags
  update() {}

  // 获取入口文件的路径
  getRootFilePath() {}
}

module.exports = Package;
