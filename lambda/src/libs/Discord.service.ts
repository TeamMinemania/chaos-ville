import {Service} from "typedi";
import axios from 'axios';
interface iDiscordReqOptions{
    uri: string,
    method?: 'post',
    data?: any;
}
// https://discord.com/developers/docs/interactions/application-commands#application-command-object-application-command-types
interface iRegisterCommandOptions{
    name: string,
    description: string,
    type: number;

    options?: iRegisterCommandOptionsOptions[]
}
interface iRegisterCommandOptionsOptions{
    name: string;
    description: string;
    required?:boolean;
    type: number
}
@Service("DiscordService")
export class DiscordService {
    registerCommand(options: iRegisterCommandOptions) {
            return this.req({
                uri: `/applications/${process.env.DISCORD_APP_ID}/guilds/${process.env.GUILD_ID}/commands`,
                data: {
                    ...options
                }
            })
            /*.then(function (response) {
                // handle success
                console.log(response);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
            })*/
    }
    req(options: iDiscordReqOptions) {
       const url = `https://discord.com/api/v10${options.uri}`;
        return axios({
            method: options.method || 'post',
            url,
            data: options.data,
            headers: {
                Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
                'Content-Type': 'application/json; charset=UTF-8',
                'User-Agent': 'DiscordBot (https://github.com/discord/discord-example-app, 1.0.0)',
            },
        })
    }
}