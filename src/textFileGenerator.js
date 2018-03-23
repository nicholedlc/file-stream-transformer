const fs = require('fs');

const buildText = (text, num, filepath) => {
    const file = fs.createWriteStream(filepath);

    for (let i = num; i > 0; i--) {
        file.write(text);
    }
    file.end();
};

module.exports = buildText;
