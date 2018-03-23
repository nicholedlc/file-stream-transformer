import test from 'ava';
const fs = require("fs");
const { Readable } = require("stream");
const chunkReport = require("./chunkReport");
const summaryReport = require("./summaryReport");
const textFileGenerator = require("./textFileGenerator");


test.cb('chunkReport', t => {
    const filePath = "./a.file";
    const unitOfText =
        "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n";
    const bytesPerText = Buffer.from(unitOfText, 'utf-8').length;
    const totalLines = 100;
    const totalBytes = bytesPerText * totalLines;

    let actualBytes = 0;
    let actualLines = 0;

    textFileGenerator(unitOfText, totalLines, filePath);

    fs.createReadStream(filePath)
        .pipe(chunkReport())
        .on("data", chunk => {
            actualBytes += chunk.byteCount;
            actualLines += chunk.lineCount;
        })
        .on("finish", () => {
            t.is(actualBytes, totalBytes)
            t.end();
        })
});

test.cb('summaryReport', t => {
    const objInput = { byteCount: 447, lineCount: 1, elapsedTime: 12 };
    const strOutput = "Line count: 1, Byte count: 447, Elapsed time: 12 ms, Throughput rate: 37.25 bytes/sec"
    const length = 5;
    const expectedOutput = Array.from({ length }, (v, i) => strOutput);

    let counter = 0;
    let actualOutput = [];

    const readableObj = new Readable({
        objectMode: true,
        read(size) {
            if (counter < length) {
                this.push(objInput);
                counter++;
            } else {
                this.push(null);
            }
        }
    });

    readableObj
        .pipe(summaryReport())
        .on("data", chunk => {
            actualOutput.push(chunk.toString().trim());
        })
        .on("finish", () => {
            t.deepEqual(actualOutput, expectedOutput);
            t.end();
        })
});