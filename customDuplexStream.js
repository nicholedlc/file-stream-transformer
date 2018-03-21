const fs = require('fs');
const server = require('http').createServer();
const { Transform } = require('stream');

// Create a duplex stream that consume line-separated text and outputs objects 
// with keys for the elapsed time, total length in bytes, and total lines.

let startTime;
let byteCount = [];
let timeArray = [];


const bytesPerSec = byteCountArray => { 
    const totalBytes = byteCountArray.reduce((acc, curr) => acc + curr) 
    const totalTime = timeArray[timeArray.length - 1] / 1000;
    return totalBytes / totalTime
};

const countLines = chunk => { chunk.toString().trim().split("\n").length }

const transformStream = new Transform({
    writableObjectMode: true,

    transform(chunk, encoding, callback) {
        const totalLines = countLines(chunk);
        const byteLength = chunk.byteLength
        const elapsedTime = Date.now() - startTime
        this.push(JSON.stringify({ totalLines, byteLength, elapsedTime }))
        callback();
    }
})

// Create a stream that takes these objects and outputs one-line 
// summary reports (human-readable). The report should include 
// the throughput rate of the input stream in bytes/sec.

const summaryReport = new Transform({
    readableObjectMode: true,
    writeableObjectMode: true,

    transform(chunk, encoding, callback) {
        chunkObj = JSON.parse(chunk)
        byteCount.push(+chunkObj.byteLength)
        timeArray.push(+chunkObj.elapsedTime)
        const byteRate = bytesPerSec(byteCount);
        this.push(JSON.stringify({ byteRate }))
        callback();
    }
})

// server.on('request', (req, res) => {
module.exports = () => {
    startTime = Date.now();
    const stream = fs.createReadStream('./big.file');
    stream
        .pipe(transformStream)
        .pipe(summaryReport)
        .pipe(process.stdout)
}

// server.listen(8000);
