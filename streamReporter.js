#!/usr/bin/env node

const fs = require('fs');
const { Transform } = require('stream');

const chunkReport = () => {
    let startTime = Date.now();

    return new Transform({
        readableObjectMode: true,

        transform(chunk, encoding, callback) {
            const lineCount = chunk.filter(byte => byte == 10).length;
            const byteCount = chunk.byteLength; // including new line characters
            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            startTime = endTime;

            this.push({ lineCount, byteCount, elapsedTime });
            callback();
        }
    });
}

const summaryReport = () => {
    return new Transform({
        writableObjectMode: true,

        transform(chunk, encoding, callback) {
            const { lineCount, byteCount, elapsedTime } = chunk;
            const throughputRate = parseFloat(byteCount / elapsedTime).toFixed(2);

            this.push(`Line count: ${lineCount}, Byte count: ${byteCount}, Elapsed time: ${elapsedTime} ms, Throughput rate: ${throughputRate} bytes/sec\n`);
            callback();
        }
    });
};

const fileStream = process.stdin.isTTY ? fs.createReadStream(process.argv[2]) : process.stdin

fileStream
    .pipe(chunkReport())
    .pipe(summaryReport())
    .pipe(process.stdout)