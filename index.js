#!/usr/bin/env node

const fs = require('fs');
const { Transform } = require('stream');
const chunkReport = require('./src/chunkReport');
const summaryReport = require('./src/summaryReport');

const fileStream = process.stdin.isTTY ? fs.createReadStream(process.argv[2]) : process.stdin

fileStream
    .pipe(chunkReport())
    .pipe(summaryReport())
    .pipe(process.stdout)
