"use strict";

module.exports = exec;

const Package = require("@test-cli-dev/package");
const log = require("@test-cli-dev/log");

const SETTINGS = {
  init: "@imooc-cli/init",
};

async function exec() {
  let targetPath = process.env.CLI_TARGET_PATH;
  const homePath = process.env.CLI_HOME_PATH;
  log.verbose("targetPath", targetPath);
  log.verbose("homePath", homePath);

  const options = arguments[arguments.length - 2];
  const cmdObj = arguments[arguments.length - 1];
  const cmdName = cmdObj.name();
  const packageName = SETTINGS[cmdName];
  const packgeVersion = "latest";

  if (!targetPath) {
    targetPath = ""; // 生存缓存路径
  }

  const pkg = new Package({
    targetPath,
    packageName,
    packgeVersion,
  });

  const result = await pkg.getRootFilePath();
  console.log(result);
}
