const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const schema = fs.readFileSync('../cache/items2.json');
const schemaObj = JSON.parse(schema);
let promptItems = schemaObj.map((o) => o.name);
const prompt = `A photo realistic backpackers hostel with the following objects in it ${promptItems.join(', ')}`

openai.createImage({
    prompt: prompt,
    n: 1,
    size: "512x512",
})
.then((response) => {
    image_url = response.data.data[0].url;
    console.log(image_url);
})
    .catch((err) => console.error(err));


