"use strict";

const {
  isObject,
  packageDirectory,
  packageDirectorySync,
} = require("@test-cli-dev/utils");
const path = require("path");
const formatPath = require("@test-cli-dev/format-path");

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
  async getRootFilePath() {
    // 1. 获取 package.json 所在目录 - pkg-dir
    console.log(this.targetPath);
    const dir = await packageDirectory({ cwd: this.targetPath });
    if (dir) {
      // 2.读取 package.json - require();
      const pkgFile = require(path.resolve(dir, "package.json"));
      // 3. 寻找 main/lib
      if (pkgFile && pkgFile.main) {
        // 4. 路径的兼容（macOS/windows）
        return formatPath(path.resolve(dir, pkgFile.main));
      }
    }
    return null;
  }
}

module.exports = Package;
