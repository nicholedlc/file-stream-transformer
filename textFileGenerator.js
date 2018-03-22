const fs = require('fs');
const file = fs.createWriteStream('./a.file');

const buildText = (text, num) => {
    for (let i = num; i > 0; i--) {
        file.write(text);
    }
    file.end();
};

module.exports = buildText;
