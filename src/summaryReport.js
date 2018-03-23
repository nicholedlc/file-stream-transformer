const { Transform } = require("stream");

const summaryReport = () => {
    return new Transform({
        writableObjectMode: true,

        transform(chunk, encoding, callback) {
        const { lineCount, byteCount, elapsedTime } = chunk;
        const throughputRate = parseFloat(byteCount / elapsedTime).toFixed(2);

        this.push(
            `Line count: ${lineCount}, Byte count: ${byteCount}, Elapsed time: ${elapsedTime} ms, Throughput rate: ${throughputRate} bytes/sec\n`
        );
        callback();
        }
    });
};

module.exports = summaryReport;
