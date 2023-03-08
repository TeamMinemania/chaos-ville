import {DiscordRouterService} from "@functions/discord/DiscordRouter.service";
import {DiscordService} from "@libs/Discord.service";

const discordRouterService = new DiscordRouterService();
discordRouterService.discordService = new DiscordService();
discordRouterService.handleS3Event({
    "Records": [
        {
            "eventVersion": "2.1",
            "eventSource": "aws:s3",
            "awsRegion": "us-east-1",
            "eventTime": "2023-03-07T23:43:31.650Z",
            "eventName": "ObjectCreated:Put",
            "userIdentity": {
                "principalId": "AWS:AIDAI3Y6HAD4QUTFYDUAA"
            },
            "requestParameters": {
                "sourceIPAddress": "24.183.61.146"
            },
            "responseElements": {
                "x-amz-request-id": "CBQCW1DA4Y602GGG",
                "x-amz-id-2": "aFIJxFoRrpUQtFqKmzhToebJuHIOu1PxiHAf4CZTxjxv0sC+mqpQRDDVtZh7f3LJ8Z/2b1D2b3YqYzYB1LdfPf4hOeSMcTaf6lsy3g4t2fA="
            },
            "s3": {
                "s3SchemaVersion": "1.0",
                "configurationId": "chaos-ville-v1-prod-s3Worker-b93725ce402f796924d265807985c1e9",
                "bucket": {
                    "name": "dreambooth-worker-v1-prod-us-east-1",
                    "ownerIdentity": {
                        "principalId": "A1DOKW9ZHDQBRX"
                    },
                    "arn": "arn:aws:s3:::dreambooth-worker-v1-prod-us-east-1"
                },
                "object": {
                    "key": "schematical-1082791977227128893/a-radio-active-factory,-16bitscene-0000.jpg",
                    "size": 233166,
                    "eTag": "d508a55f4426e50c219321f3e4a3333c",
                    "sequencer": "006407CC238B212BE2"
                }
            }
        }
    ]
});