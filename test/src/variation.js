const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


openai.createImageVariation(
    fs.createReadStream("policeQuestClassRoom.png"),
    1,
    "512x512"
)
.then((response) => {
    image_url = response.data.data[0].url;
    console.log(image_url);
})
    .catch((err) => console.error(err.response.data.error));


