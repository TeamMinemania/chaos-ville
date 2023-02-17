import "reflect-metadata";
import { Container, Inject, Service } from "typedi";

import { BaseService } from "../../../libs/Base.service";
import pluralize from "pluralize";
import _ from "lodash";
import DataLoader from "dataloader";
import {Game} from "./Game";
import {UserInputError} from "apollo-server";
import {HydratedDocument} from "mongoose";

const fs = require('fs');
const { Configuration, OpenAIApi } = require("openai");

@Service("GameService")
export class GameService extends BaseService(Game) {
  @Inject("GameModel")
  private gameModel;
  private openai;
  constructor() {
    super();
    const configuration = new Configuration({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);
  }
  async createOne(input: Partial<Game>): Promise<HydratedDocument<Game>> {
    if (!input.prompts.location) {
      throw new UserInputError("Missing `location` prompt");
    }
    if (!input.prompts.mission) {
      throw new UserInputError("Missing `mission` prompt");
    }
    if (!input.prompts.style) {
      throw new UserInputError("Missing `style` prompt");
    }
    if (!input.prompts.writer) {
      throw new UserInputError("Missing `writer` prompt");
    }
    const game = await super.createOne(input) as HydratedDocument<Game>;


    const schema = fs.readFileSync('C:\\Users\\mlea\\WebstormProjects\\aiville\\test\\src\\schemas\\scene.json');
    const prompt = `
      If I gave you template JSON like:
      \`\`\`
      ${schema}
      \`\`\`
      In less than 1000 tokens please generate valid JSON for a room with 3 items that have 2 interactions a piece that you would find in a ${game.prompts.location}?
    `;
console.log("PROMPT: ", prompt);
/*    const completion = await this.openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      temperature: .5,
      max_tokens: 2000,
      top_p: 1.0,
      frequency_penalty: 0.2,
      presence_penalty: 0.0,
      stop: ["{DONE}"],
    });
    console.log("completion.data.choices[0].text: ", completion.data.choices[0].text);
    game.scenes = [JSON.parse(completion.data.choices[0].text)];
    await game.save();*/

    return game;
  }

}
