'use strict';

const gitNpmInfo = require('..');
const assert = require('assert').strict;

assert.strictEqual(gitNpmInfo(), 'Hello from gitNpmInfo');
console.info('gitNpmInfo tests passed');
