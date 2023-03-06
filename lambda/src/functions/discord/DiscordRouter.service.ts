import 'reflect-metadata';
import "../../libs/Discord.service";
import {DiscordService} from "../../libs/Discord.service";
import {Inject, Service} from "typedi";
import { InteractionType, InteractionResponseType, verifyKey  } from 'discord-interactions';
import config  from 'config';
import AWS from 'aws-sdk';
@Service("DiscordRouterService")
export class DiscordRouterService {
    @Inject("DiscordService")
    private discordService: DiscordService;
    batch: AWS.Batch = new AWS.Batch({
        region: config.get('aws.region')
    });
    middleware (req, res, buf, encoding) {
        const signature = req.get('X-Signature-Ed25519');
        const timestamp = req.get('X-Signature-Timestamp');

        const isValidRequest = verifyKey(buf, signature, timestamp, config.get('discord.publicKey'));
        if (!isValidRequest) {
            res.status(401).send('Bad request signature');
            throw new Error('Bad request signature');
        }

    }
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
    async interactions (req, res){
        try {
            const {type, id, data, member} = req.body;
            if (type === InteractionType.PING) {
                return res.json({type: InteractionResponseType.PONG});
            }
            console.log("req.body:", req.body);
            if (type === InteractionType.APPLICATION_COMMAND) {
                // Slash command with name of "test"
                if (data.name === 'dreambooth') {
                    const prompt = "An empty desert with skulls, buzzards and cactusses";
                    const params = {
                        jobDefinition: config.get('aws.batch.jobDefinition'),
                        jobName: member.user.username + '-' + id,
                        jobQueue: config.get('aws.batch.jobQueue'),
                        containerOverrides: {
                            command: [
                                "conda", "run", "--no-capture-output", "-n", "ldm", "/bin/bash", "-c",
                                `/home/ubuntu/run.sh test "${prompt}, 16bitscene"`
                            ]
                        }
                    };
                    const response = await this.batch.submitJob(params).promise();
                    console.log("BATCH: ", response);
                    // Send a message as response
                    return res.send({
                        type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                        data: {content: 'Job Submitted: ' + response.jobId + '   ' + response.jobName},
                    });
                }
            }

            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {content: 'No idea what your talking about'},
            });
        }catch(err){
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {content: 'Error: ' + err.message },
            });
        }
    }
    test (req, res){
        res.json({hello:"WOrld"});
    }

}