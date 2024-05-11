"use strict";

module.exports = core;

const log = require("@test-cli-dev/log");
const semver = require("semver");
const colors = require("colors/safe");

const contant = require("./contant");
const pkg = require("../package.json");

function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
  } catch (e) {
    log.error(e.message);
  }
}

function checkNodeVersion() {
  // 获取当前版本号
  const currentVersion = process.version;
  // 对比最低版本号
  const lowestVersion = contant.LOWEST_NODE_VERSION;

  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`test-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`)
    );
  }
}

function checkPkgVersion() {
  log.notice("version", pkg.version);
}
