"use strict";

module.exports = core;

const log = require("@test-cli-dev/log");

const pkg = require("../package.json");

function core() {
  try {
    checkPkgVersion();
  } catch (e) {
    log.error(e.message);
  }
}

function checkPkgVersion() {
  log.notice("version", pkg.version);
}
