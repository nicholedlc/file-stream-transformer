const fs = require('fs');
const { Transform } = require('stream');

const chunkReport = () => {
    let startTime = Date.now();

    return new Transform({
        writeableObjectMode: true,

        transform(chunk, encoding, callback) {
            const lineCount = chunk.filter(byte => byte == 10).length;
            const byteCount = chunk.byteLength; // including new line characters
            const endTime = Date.now();
            const elapsedTime = endTime - startTime;
            startTime = endTime;

            this.push(JSON.stringify({ lineCount, byteCount, elapsedTime }));
            callback();
        }
    });
}

const summaryReport = () => {
    return new Transform({
        readableObjectMode: true,

        transform(chunk, encoding, callback) {
            const { lineCount, byteCount, elapsedTime } = JSON.parse(chunk);
            const throughputRate = parseFloat(byteCount / elapsedTime).toFixed(2);

            this.push(`Line count: ${lineCount}, Byte count: ${byteCount}, Elapsed time: ${elapsedTime} ms, Throughput rate: ${throughputRate} bytes/sec\n`);
            callback();
        }
    });
};

const fileStream = fs.createReadStream('./big.file');

fileStream
    .pipe(chunkReport())
    .pipe(summaryReport())
    .pipe(process.stdout)