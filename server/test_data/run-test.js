// running sample text until ocr scanner can provides it

const fs = require('fs');
const analyzer = require('../utils/cv-analyzer');

const text = fs.readFileSync('./server/test_data/sample_text.txt', 'utf-8');  // reading sample textfile. update when OCR scanner implemented.

const result = analyzer.processCV(text);
console.log(JSON.stringify(result, null, 2));