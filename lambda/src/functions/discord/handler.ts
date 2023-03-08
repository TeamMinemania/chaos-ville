import {S3CreateEvent} from "aws-lambda";
import serverlessExpress from '@vendia/serverless-express';
import app from './app';
import {Container} from "typedi";
import "./DiscordRouter.service"
import {DiscordRouterService} from "./DiscordRouter.service";
// ...
const discordRouterService: DiscordRouterService = Container.get<DiscordRouterService>("DiscordRouterService");


exports.main = serverlessExpress({ app })

export const s3Worker = async (
    event: S3CreateEvent
)/*: Promise<APIGatewayProxyResult>*/ => {
   return discordRouterService.handleS3Event(event);
};