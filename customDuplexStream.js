const fs = require('fs');
const server = require('http').createServer();
const { Transform } = require('stream');

// Create a duplex stream that consume line-separated text and outputs objects 
// with keys for the elapsed time, total length in bytes, and total lines.

let startTime;

const transformStream = new Transform({
    readableObjectMode: true,
    writableObjectMode: true,
    transform(chunk, encoding, callback) {
        const totalLines = chunk.toString().trim().split("\n").length;
        const totalBytes = chunk.byteLength
        const elapsedTime = Date.now() - startTime
        this.push(JSON.stringify({ totalLines, totalBytes, elapsedTime }))
        callback();
    }
})

server.on('request', (req, res) => {
    startTime = Date.now();
    const stream = fs.createReadStream('./big.file');
    stream
        .pipe(transformStream)
        .pipe(process.stdout)
})

server.listen(8000);