#!/usr/bin/env node

const fs = require('fs');
const { Transform } = require('stream');
const chunkReport = require('./chunkReport');
const summaryReport = require('./summaryReport');

const fileStream = process.stdin.isTTY ? fs.createReadStream(process.argv[2]) : process.stdin

fileStream
    .pipe(chunkReport())
    .pipe(summaryReport())
    .pipe(process.stdout)
