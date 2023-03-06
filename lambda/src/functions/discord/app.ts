import express from 'express';
import 'reflect-metadata';
import "./DiscordRouter.service"
import {DiscordRouterService} from "./DiscordRouter.service";
import {Container} from "typedi";
const discordRouterService: DiscordRouterService = Container.get<DiscordRouterService>("DiscordRouterService");

const app = express();
app.use(
    express.json(
        {
            verify: discordRouterService.middleware.bind(discordRouterService)
        }
    )
);
app.get('/test', discordRouterService.test.bind(discordRouterService));
app.get('/register', discordRouterService.register.bind(discordRouterService));
app.post('/interactions', discordRouterService.interactions.bind(discordRouterService));
export default app;