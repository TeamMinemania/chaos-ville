const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const prompt = `If I gave you a template function for javascript like:

\`\`\`
NPCManager.add({
   name: "Convivence Store Clerk",
   interactions: [
      {
         "command": "Buy Soda",
         "success": {
   "response": "Here you go",
"actions": [
{
   "action":"INV_ADD",
"object_id": "soda",
"qty": 1
},
{
   "action":"INV_REMOVE",
"object_id": "money",
"qty": 2
}
]
}
   "requirements": {
"money":2.00
      }
   ]
});

\`\`\`
Could you generate 5 more npcs with 3 interactions a piece?{DONE}`;


openai.createCompletion({
    model: "text-davinci-003",
    prompt: prompt,
    temperature: 0,
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