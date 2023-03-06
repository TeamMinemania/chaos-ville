import 'reflect-metadata';
import "../../libs/Discord.service";
import {DiscordService} from "../../libs/Discord.service";
import {Inject, Service} from "typedi";
@Service("DiscordRouterService")
export class DiscordRouterService {
    @Inject("DiscordService")
    private discordService: DiscordService;
    async register (req, res) {
        try {
            const response = await this.discordService.registerCommand({
                name: 'dreambooth',
                description: 'send stuff to dreambooth',
                type: 1,
                options: [
                    {
                        name: 'prompt',
                        description: 'What do you want to see?',
                        type: 3
                    }
                ]
            });
            console.log("results", response.data)
            res.json(response.data);
        }catch(e) {
            e = e.response && e.response.data.errors || e;
            console.error(e);
            res.json(e);
        }


    }
    interaction (req, res){
        console.log(res.body)
        res.json({hello:"WOrld"});
    }
    test (req, res){
        res.json({hello:"WOrld"});
    }

}