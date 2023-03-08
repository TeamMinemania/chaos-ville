import 'reflect-metadata';
import "../../libs/Discord.service";
import {DiscordService} from "../../libs/Discord.service";
import {Inject, Service} from "typedi";
import { InteractionType, InteractionResponseType, verifyKey  } from 'discord-interactions';
import config  from 'config';
import AWS from 'aws-sdk';
import { S3Event } from 'aws-lambda';
import { Snowflake } from 'nodejs-snowflake';
const FormData = require('form-data');
@Service("DiscordRouterService")
export class DiscordRouterService {

    @Inject("DiscordService")
    public discordService: DiscordService;
    s3: AWS.S3 = new AWS.S3({
        region: config.get('aws.region')
    });
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
    /*
        {
          app_permissions: '1071631420481',
          application_id: '569134998444179466',
          channel_id: '477184896171900931',
          data: {
            guild_id: '477184896171900928',
            id: '1082347307313410059',
            name: 'dreambooth',
            options: [ [Object] ],
            type: 1
          },
          entitlement_sku_ids: [],
          guild_id: '477184896171900928',
          guild_locale: 'en-US',
          id: '1082391697771737239',
          locale: 'en-US',
          member: {
            avatar: null,
            communication_disabled_until: null,
            deaf: false,
            flags: 0,
            is_pending: false,
            joined_at: '2018-08-09T18:42:24.916000+00:00',
            mute: false,
            nick: null,
            pending: false,
            permissions: '4398046511103',
            premium_since: null,
            roles: [ '503591195507687424' ],
            user: {
              avatar: 'bd2c08c39cf0da58eb7301d82dcd9220',
              avatar_decoration: null,
              discriminator: '5448',
              display_name: null,
              id: '477184840182136854',
              public_flags: 0,
              username: 'schematical'
            }
          },
          token: 'aW50ZXJhY3Rpb246MTA4MjM5MTY5Nzc3MTczNzIzOTpBdEhuYnVGU0l0Vkhsb21xT1pHOFlyQ1FWTUdnWG1wMHJsRnpQYmZOYlk0bUVWU0VuSW5NbWJLbnVMRDF6MHFYNDd2Q3U1Y0NHeG9wd2FNSmROTlJ4RDBwM3hXYnBSblhJNVdjdUcxQVNtcUd5MEdHUmdycTIwSUJDZ3dxRXcyTg',
          type: 2,
          version: 1
        }
     */
    async interactions (req, res){
        try {
            const {type, id, data, member} = req.body;
            if (type === InteractionType.PING) {
                return res.json({type: InteractionResponseType.PONG});
            }
            console.log("req.body:", JSON.stringify(req.body, null, 3));
            if (type === InteractionType.APPLICATION_COMMAND) {
                // Slash command with name of "test"
                if (data.name === 'dreambooth') {
                    const promptOption = data.options.find((option) => option.name === 'prompt');
                    if (!promptOption) {
                        throw new Error("Missing `prompt` option");
                    }
                    const s3Path = member.user.username + '-' + member.user.id + '/' + id;
                    const prompt = promptOption.value; // "An empty desert with skulls, buzzards and cactusses";
                    const params = {
                        jobDefinition: config.get('aws.batch.jobDefinition'),
                        jobName: member.user.username + '-' + member.user.id + '-' + id,
                        jobQueue: config.get('aws.batch.jobQueue'),
                        containerOverrides: {
                            command: [
                                "conda", "run", "--no-capture-output", "-n", "ldm", "/bin/bash", "-c",
                                `/home/ubuntu/run.sh ${s3Path} "${prompt}, 16bitscene"`
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
            console.error("CAUGHT ERR: ", err);
            return res.send({
                type: InteractionResponseType.CHANNEL_MESSAGE_WITH_SOURCE,
                data: {content: 'Error: ' + err.message },
            });
        }
    }
    test (req, res){
        res.json({hello:"WOrld"});
    }
    async handleS3Event(event: S3Event) {
        console.log("S3Event: ", JSON.stringify(event, null, 3));
        const filteredRecords = event.Records.filter((record) => {
            return record.s3.object.key.substr(record.s3.object.key.length - 4) ===  '.jpg';
        });
        console.log("filteredRecords: ", filteredRecords);
        for(let record of filteredRecords) {
            const key = record.s3.object.key;
            const parts = key.split('/');
            const parts2 = parts[0].split('-');
            const messageId = parts[1];
            const username = parts2[0];
            const userId = parts2[1]


            // const url = 'https://sc-cloud-formation-v1.s3.amazonaws.com/a-radio-active-factory%2C-16bitscene-0000.jpg';
            const params = {
                Bucket: record.s3.bucket.name,
                Key: record.s3.object.key
            };
            // const url = await this.s3.getSignedUrlPromise('getObject', params);
            // console.log("URL: ", url);
            const uid = new Snowflake();



            try {
console.log("params", params);
                const s3Response = await this.s3.getObject(params).promise();
                const formData = new FormData();
                // const blob = new Blob([s3Response.Body.toBy()], { type: "image/jpg" });
                formData.append('files[0]', s3Response.Body, 'image.jpg'); // blob, 'image.jpg')
                const response = await this.discordService.sendMessage(
                    {
                        content: `<@${userId}> your job has finished`,
                    /*    attachments: [
                            {
                                id: uid.getUniqueID().toString(),
                                filename: 'image.jpg',
                                /!*description: key,
                                height:2058,
                                width: 516,
                                // url,
                                size: record.s3.object.size,
                                content_type: 'image/jpg'*!/
                            }
                        ],*/
                        allowed_mentions: {
                            parse: ["users"]
                            //  users: [username]
                        }
                    },
                    formData
                );
                console.log("this.discordService.sendMessage:", response);
            }catch(e) {
                console.log("e.response?.config: ", e.response?.config?.data);
                console.error("ERROR: ", e.response &&  JSON.stringify(e.response.data.errors, null, 3)  || e);
            }
        }

    }
}