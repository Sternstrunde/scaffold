"use strict";

const path = require("path");
const fsPromises = require("fs/promises");
const fs = require("fs");
const { fileURLToPath } = require("url");

function isObject(o) {
  return Object.prototype.toString.call(o) === "[object Object]";
}

const toPath = (urlOrPath) =>
  urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;

async function findUp(name, { cwd = process.cwd(), type = "file", stopAt }) {
  let directory = path.resolve(toPath(cwd) ?? "");
  const { root } = path.parse(directory);
  stopAt = path.resolve(directory, toPath(stopAt ?? root));

  while (directory && directory !== stopAt && directory !== root) {
    const filePath = path.isAbsolute(name) ? name : path.join(directory, name);

    try {
      const stats = await fsPromises.stat(filePath); // eslint-disable-line no-await-in-loop
      if (
        (type === "file" && stats.isFile()) ||
        (type === "directory" && stats.isDirectory())
      ) {
        return filePath;
      }
    } catch {}

    directory = path.dirname(directory);
  }
}

function findUpSync(name, { cwd = process.cwd(), type = "file", stopAt } = {}) {
  let directory = path.resolve(toPath(cwd) ?? "");
  const { root } = path.parse(directory);
  stopAt = path.resolve(directory, toPath(stopAt) ?? root);

  while (directory && directory !== stopAt && directory !== root) {
    const filePath = path.isAbsolute(name) ? name : path.join(directory, name);

    try {
      const stats = fs.statSync(filePath, { throwIfNoEntry: false });
      if (
        (type === "file" && stats?.isFile()) ||
        (type === "directory" && stats?.isDirectory())
      ) {
        return filePath;
      }
    } catch {}

    directory = path.dirname(directory);
  }
}

async function packageDirectory({ cwd } = {}) {
  const filePath = await findUp("package.json", { cwd });
  return filePath && path.dirname(filePath);
}

function packageDirectorySync({ cwd } = {}) {
  const filePath = findUpSync("package.json", { cwd });
  return filePath && path.dirname(filePath);
}

module.exports = { isObject, packageDirectory, packageDirectorySync };
