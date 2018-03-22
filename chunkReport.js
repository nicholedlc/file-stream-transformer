const { Transform } = require("stream");

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
};

module.exports = chunkReport;
