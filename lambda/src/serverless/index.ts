import {LambdaSecurityGroup} from "./resources/LambdaSecurityGroup";
const region = `us-east-1`;
import { AWS } from '@serverless/typescript';
import discord, {s3Worker} from '@functions/discord';
import gql from '@functions/gql';
import * as process from "process";
const ApiGatewayMethodPropertyName = 'ApiGatewayMethodChaosvilleAny';
const serverlessConfiguration: AWS = {
    service: 'chaos-ville-v1',
    frameworkVersion: '3',
    custom: {
        webpack: {
            webpackConfig: './webpack.config.js',
            includeModules: {
                forceExclude: ['aws-sdk'],
            },
        },
    },

    plugins: [

        'serverless-webpack',
        'serverless-offline',
    ],
    provider: {
        name: 'aws',
        runtime: 'nodejs16.x',
        profile: 'schematical',
        region,
        lambdaHashingVersion: '20200924' as any,
        apiGateway: {
            // @ts-ignore
            restApiId: { 'Fn::ImportValue': 'schematical-platform-v1-APIGateway' },
            // @ts-ignore
            restApiRootResourceId: { 'Fn::ImportValue': 'schematical-platform-v1-APIGatewayRootResourceId' },
            minimumCompressionSize: 1024,
            shouldStartNameWithService: true,
        },
        environment: {
            AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
            NODE_ENV: "${opt:stage, 'test'}",
            DB_URL: process.env.DB_URL,
            DISCORD_APP_ID:  process.env.DISCORD_APP_ID,
            DISCORD_PUBLIC_KEY: process.env.DISCORD_PUBLIC_KEY,
            DISCORD_TOKEN: process.env.DISCORD_TOKEN,
            OPENAI_API_KEY: process.env.OPENAI_API_KEY
        },
    },
    resources: {
        Resources: {
            LambdaSecurityGroup,
        },
        extensions: {
            GqlLambdaFunction: {
                Properties: {
                    /*TracingConfig: {
                        Mode : "Active"
                    },*/
                    VpcConfig: {
                        SecurityGroupIds: [
                            {
                                Ref: 'LambdaSecurityGroup',
                            },
                        ],
                        SubnetIds: [
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetA`
                                }
                            },
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetB`
                                }
                            },
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetC`
                                }
                            }
                        ]
                    },
                },
            },
            DiscordLambdaFunction: {
                Properties: {
                   /* TracingConfig: {
                        Mode : "Active"
                    },*/
                    VpcConfig: {
                        SecurityGroupIds: [
                            {
                                Ref: 'LambdaSecurityGroup',
                            },
                        ],
                        SubnetIds: [
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetA`
                                }
                            },
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetB`
                                }
                            },
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetC`
                                }
                            }
                        ]
                    },
                },
            },
            S3WorkerLambdaFunction: {
                Properties: {
                    /*TracingConfig: {
                        Mode : "Active"
                    },*/
                    VpcConfig: {
                        SecurityGroupIds: [
                            {
                                Ref: 'LambdaSecurityGroup',
                            },
                        ],
                        SubnetIds: [
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetA`
                                }
                            },
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetB`
                                }
                            },
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-PrivateSubnetC`
                                }
                            }
                        ]
                    },
                },
            },
            IamRoleLambdaExecution: {
                Properties: {
                    Policies: [
                        {
                            PolicyName: 'CreateNetworkInterfaceAndXRay',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Sid: 'VisualEditor0',
                                        Effect: 'Allow',
                                        Action: [
                                            'ec2:CreateNetworkInterface',
                                            'ec2:DescribeNetworkInterfaces',
                                            'ec2:DeleteNetworkInterface',
                                        ],
                                        Resource: '*',
                                    },
                                    {
                                        Effect: 'Allow',
                                        Action: ['xray:PutTraceSegments', 'xray:PutTelemetryRecords'],
                                        Resource: ['*'],
                                    },
                                    {
                                        "Effect": "Allow",
                                        "Action": [
                                            "logs:CreateLogStream",
                                            "logs:CreateLogGroup",
                                            "logs:PutLogEvents"
                                        ],
                                        "Resource": [
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-\${opt:stage, 'test'}-*`
                                            },
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-\${opt:stage, 'test'}-*:*`
                                            },
                                           /* {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-\${opt:stage, 'test'}-custom-resource-existing-s3`
                                            },
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-\${opt:stage, 'test'}-custom-resource-existing-s3:*`
                                            },*/
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-worker-\${opt:stage, 'test'}-*:*`
                                            }
                                        ]
                                    },
                                    {
                                        "Effect": "Allow",
                                        "Action": [
                                            "batch:SubmitJob"
                                        ],
                                        "Resource": [
                                            // "arn:aws:batch:us-east-1:368590945923:job-definition/dreambooth-worker-v1-prod-us-east-1:*",


                                            {
                                                "Fn::Sub": "arn:aws:batch:\${AWS::Region}:\${AWS::AccountId}:job-definition/dreambooth-worker-v1-\${opt:stage, 'test'}-\${AWS::Region}:*"
                                            },
                                            {
                                                "Fn::ImportValue": {
                                                    "Fn::Sub": `dreambooth-worker-v1-\${AWS::Region}-\${opt:stage, 'test'}-JobQueue`
                                                }
                                            }
                                            /*{
                                                "Fn::Join": [
                                                    "",
                                                    [
                                                        {
                                                            "Fn::ImportValue": {
                                                                "Fn::Sub": `dreambooth-worker-v1-\${AWS::Region}-\${opt:stage, 'test'}-JobDefinition`
                                                            }
                                                        },
                                                        ":*"
                                                    ]
                                                ]
                                            },*/

                                            // "arn:aws:batch:us-east-1:368590945923:job-queue/dreambooth-worker-v1-prod-us-east-1"


                                        ]
                                    },
                                    {
                                        "Effect": "Allow",
                                        "Action": [
                                            "s3:getObject"
                                        ],
                                        "Resource": [
                                            {
                                               "Fn::Sub": `arn:aws:s3:::dreambooth-worker-v1-\${opt:stage, 'test'}-\${AWS::Region}/**`
                                            }
                                        ]
                                    },
                                ],
                            },
                        },
                        /*{
                            PolicyName: 'ConsumeKinesis',
                            PolicyDocument: {
                                Version: '2012-10-17',
                                Statement: [
                                    {
                                        Sid: 'VisualEditor0',
                                        Effect: 'Allow',
                                        Action: [
                                            'kinesis:PutRecords',
                                            'kinesis:GetRecords',
                                            'kinesis:GetShardIterator',
                                            'kinesis:DescribeStream',
                                            'kinesis:ListShards',
                                            'kinesis:ListStreams',
                                        ],
                                        Resource: kinesisARN,
                                    },
                                ],
                            },
                        },*/
                    ],
                },
            },
            // @ts-ignore
            [ApiGatewayMethodPropertyName]: {
                "Properties": {
                    "Integration": {
                        "IntegrationHttpMethod": "POST",
                        "Type": "AWS_PROXY",
                        "Uri": {
                            "Fn::Join": [
                                "",
                                [
                                    "arn:aws:apigateway:",
                                    region,
                                    ":lambda:path/2015-03-31/functions/arn:aws:lambda:",
                                    region,
                                    ":",
                                    {"Ref": "AWS::AccountId"},
                                    `:function:\${self:service,'somethingiswrong'}-\${stageVariables.ENV}-gql`,
                                    "/invocations"
                                ]
                            ]
                        }
                    },
                }
            },
           /* // @ts-ignore
            KinesisWorkerEventSourceMappingKinesisRskinesisv1dev: {
                "Properties": {
                    MaximumRetryAttempts: 1,
                    FilterCriteria: options?.kinesisFilterCriteria || null
                }
            },*/
            // @ts-ignore
           /* KinesisWorkerLambdaFunction: {
                Properties: {
                    TracingConfig: {
                        Mode: "Active"
                    },
                    VpcConfig: {
                        SecurityGroupIds: [
                            {
                                Ref: 'LambdaSecurityGroup',
                            },
                        ],
                        SubnetIds: [
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `${AWS::Region}-\${opt:stage, 'dev'}-PrivateSubnetA`
                                }
                            },
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `${AWS::Region}-\${opt:stage, 'dev'}-PrivateSubnetB`
                                }
                            },
                            {
                                "Fn::ImportValue": {
                                    "Fn::Sub": `${AWS::Region}-\${opt:stage, 'dev'}-PrivateSubnetC`
                                }
                            }
                        ]
                    }
                }
            }*/
        },
        Outputs: {
            "SecurityGroup" : {
                "Description": "The SecurityGroup of the SharedElastiCacheCluster",
                "Value": {"Ref": "LambdaSecurityGroup"},
                "Export": {
                    "Name": `\${self:service,'somethingiswrong'}-v1-\${opt:stage, 'dev'}-sg`
                }
            }
        }
    },
    functions: {
        gql,
        discord,
        s3Worker
        /*kinesisWorker: {
            name: `\${self:service,'somethingiswrong'}-worker-v1-\${opt:stage, 'test'}`,
            handler: 'src/kinesisWorker.kinesisHandler',
            events: [
                {
                    stream: {
                        arn: kinesisARN,
                        type: 'kinesis',
                        batchSize: 10,
                        startingPosition: 'LATEST',
                    },
                },
            ],
            package: {
                // excludeDevDependencies: false,
            },
        },*/
    },
};
export { serverlessConfiguration }