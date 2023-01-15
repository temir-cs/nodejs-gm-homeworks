const fs = require('fs');
const csv = require('csvtojson');
const path = require('path');

const CSV_DIR_PATH = './csv';
const TXT_DIR_PATH = './txt';

async function csvToTxt() {
    try {
        const dirFiles = await fs.promises.readdir(CSV_DIR_PATH);
        if (!dirFiles.length) throw new Error('The given directory appears to be empty.');

        dirFiles.forEach((filename) => {
            const csvFilePath = `${CSV_DIR_PATH}/${filename}`;
            const readable = fs.createReadStream(csvFilePath);
            const writable = fs.createWriteStream(`${TXT_DIR_PATH}/${path.parse(filename).name}.txt`);
            readable
                .pipe(csv({ delimiter: 'auto' }).fromFile(csvFilePath))
                .pipe(writable)
                .on('error', (err) => {
                    throw new Error(err);
                });
        });
    } catch (error) {
        console.log('Error: ', error);
    }
}

csvToTxt();
