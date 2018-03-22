const assert = require("assert");
const fs = require("fs");
const { Transform } = require("stream");
const chunkReport = require("./chunkReport");
const summaryReport = require("./summaryReport");
const buildText = require("./textFileGenerator");


function testAddTwoNumbers() {
  var x = 5;
  var y = 1;
  var sum1 = x + y;
  var sum2 = addTwoNumbers(x, y);

  console.log("addTwoNumbers() should return the sum of its two parameters.");
  console.log("Expect " + sum1 + " to equal " + sum2 + ".");

  try {
    assert.equal(sum1, sum2);

    console.log("Passed.");
  } catch (error) {
    console.error("Failed.");
  }
}

const unitOfText =
  "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.\n";

const bytesPerText = Buffer.from(unitOfText, 'utf-8').length;

const stringifyChunkReport = new Transform({
  readableObjectMode: true,
  writableObjectMode: true,

  transform(chunk, encoding, callback) {
      this.push(JSON.stringify(chunk))
      callback();
  }
});

const testChunkReport = () => {
    const lineCount = 100;
    const byteCount = bytesPerText * lineCount;
    const fileStream = fs.createReadStream("./a.file")
    console.log(byteCount)
    // Test total
    buildText(unitOfText, lineCount);
    
    fileStream
        .pipe(chunkReport())
        .pipe(stringifyChunkReport)
        .pipe(process.stdout);
};

testChunkReport();
