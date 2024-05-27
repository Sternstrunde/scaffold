"use strict";

module.exports = exec;

const Package = require("@test-cli-dev/package");

function exec() {
  const pkg = new Package();

  console.log(pkg);
}
