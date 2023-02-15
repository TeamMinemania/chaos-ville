const fs = require('fs');
const dirPath = './sources/items';
// read files in dir
fs.readdirSync(dirPath).forEach((fileLoc) => {
    // read each file individually
    console.log(fileLoc);
    const rawBody = fs.readFileSync(dirPath + '/' + fileLoc).toString();
    const body = JSON.parse(rawBody);
    console.log(body);
});
// Seperate out prompt from the text
