import {S3CreateEvent} from "aws-lambda";

import "./DiscordRouter.service"
import {DiscordRouterService} from "./DiscordRouter.service";
// ...
const discordRouterService: DiscordRouterService = Container.get<DiscordRouterService>("DiscordRouterService");

import serverlessExpress from '@vendia/serverless-express';
import app from './app';
import {Container} from "typedi";
exports.main = serverlessExpress({ app })

export const main2 = async (
    event: S3CreateEvent
)/*: Promise<APIGatewayProxyResult>*/ => {
   return discordRouterService.handleS3Event(event);
};