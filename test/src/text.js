const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const schema = fs.readFileSync('./src/schemas/item.json');
const prompt = `If I gave you template JSON like:

\`\`\`
${schema}
\`\`\`
Could you generate 3 more items you would find in a teenagers bedroom with 3 interactions a piece?{DONE}`;

openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: .5,
    max_tokens: 1000,
    top_p: 1.0,
    frequency_penalty: 0.2,
    presence_penalty: 0.0,
    stop: ["{DONE}"],
})
    .then((completion) => {
        console.log(completion.data.choices[0].text);
    })
    .catch((err) => console.error(err.response.data.error));



