"use strict";

module.exports = core;

const log = require("@test-cli-dev/log");
const { getNpmSemverVersion } = require("@test-cli-dev/get-npm-info");
const semver = require("semver");
const colors = require("colors/safe");
const userHome = require("user-home");
const commander = require("commander");

const contant = require("./contant");
const pkg = require("../package.json");
const fs = require("fs");
const fsPromises = require("fs/promises");
const path = require("path");
let args, config;

const program = new commander.Command();

async function core() {
  try {
    prepare();
    registerCommand();
  } catch (e) {
    log.error(e.message);
  }
}

function prepare() {
  checkPkgVersion();
  checkNodeVersion();
  checkUserHome();
  // checkInputArgs();
  checkEnv();
  // await checkGlobalUpdate();
}

// 脚手架初始化+全局参数注册
function registerCommand() {
  program
    .name(Object.keys(pkg.bin)[0])
    .usage("<command> [options]")
    .version(pkg.version)
    .option("-d,--debug", "是否开启调试模式", false)
    .option("-tp,--targetPath", "是否指定本地调试文件路径", "");

  program.on("option:debug", function () {
    if (program.opts().debug) {
      process.env.LOG_LEVEL = "verbose";
    } else {
      process.env.LOG_LEVEL = "info";
    }
    log.level = process.env.LOG_LEVEL;
  });
  program.on("option:targetPath", function () {
    console.log(program.opts().targetPath);
    process.env.CLI_TARGET_PATH = program.opts().targetPath;
  });

  program.parse(process.argv);
  if (program.args && program.args.length < 1) {
    program.outputHelp(); // 打印出帮助文档
    console.log();
  }
}

async function checkGlobalUpdate() {
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  const lastVersion = await getNpmSemverVersion(npmName, currentVersion);
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      "更新提示",
      colors.yellow(
        `请手动更新${npmName}，当前版本：${currentVersion}，最新版本：${lastVersion}
      更新命令：npm install -g ${npmName}
    `
      )
    );
  }
}

function checkEnv() {
  const dotenv = require("dotenv");
  const dotenvPath = path.resolve(userHome, ".env");
  if (pathExists(dotenvPath)) {
    config = dotenv.config({
      path: dotenvPath,
    });
  }

  createDefaultConfig();

  log.verbose("环境变量", process.env.CLI_HOME_PATH);
}

function createDefaultConfig() {
  const cliConfig = {
    home: userHome,
  };
  if (process.env.CLI_HOME) {
    cliConfig["cliHome"] = path.join(userHome, process.env.CLI_HOME);
  } else {
    cliConfig["cliHome"] = path.join(userHome, contant.DEFAULT_CLI_HOME);
  }
  process.env.CLI_HOME_PATH = cliConfig.cliHome;
  // console.log(process.env.CLI_HOME_PATH);
}

function checkInputArgs() {
  const minimist = require("minimist");
  args = minimist(process.argv.slice(2));
  // console.log(args);
  checkArgs();
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = "verbose";
  } else {
    process.env.LOG_LEVEL = "info";
  }

  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  if (!userHome || !pathExistsSync(userHome)) {
    throw new Error(colors.red("当前登录用户主目录不存在!"));
  }
  // console.log(userHome);
}

async function pathExists(path) {
  try {
    await fsPromises.access(path);
    return true;
  } catch {
    return false;
  }
}

function pathExistsSync(path) {
  try {
    fs.accessSync(path);
    return true;
  } catch {
    return false;
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
