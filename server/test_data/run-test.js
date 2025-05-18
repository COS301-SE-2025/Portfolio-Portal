// running sample text until ocr scanner can provides it

const fs = require('fs');
const analyzer = require('../utils/cv-analyzer');

const text = fs.readFileSync('./sample_text.txt', 'utf-8');  // reading sample textfile

const result = analyzer.processCV(text);
console.log(result);