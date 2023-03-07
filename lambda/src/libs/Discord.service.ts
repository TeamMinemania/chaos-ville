import {Service} from "typedi";
import axios from 'axios';
import config  from 'config';
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
// https://discord.com/developers/docs/resources/channel#create-message
interface iSendMessageOptions{
    content?:string;
    attachments?: iSendMessageAttachment[],
    allowed_mentions?: iSendMessageAllowedMention
}
// https://discord.com/developers/docs/resources/channel#attachment-object
interface iSendMessageAttachment{
    id: string;
    url: string;
    filename: string;
    size: number;
}
interface iSendMessageAllowedMention{
    parse: string[],
    users?: string[]
}
@Service("DiscordService")
export class DiscordService {
    registerCommand(options: iRegisterCommandOptions) {
            return this.req({
                uri: `/applications/${config.get('discord.appId')}/guilds/${config.get('discord.guildId')}/commands`,
                data: {
                    ...options
                }
            });
    }
    sendMessage(options: iSendMessageOptions) {
            return this.req({
                uri: `/channels/${config.get('discord.channel')}/messages`,
                data: {
                    ...options
                }
            });
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