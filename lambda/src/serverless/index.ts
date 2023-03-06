import {LambdaSecurityGroup} from "./resources/LambdaSecurityGroup";
const region = `us-east-1`;
import { AWS } from '@serverless/typescript';
import discord from '@functions/discord';
import gql from '@functions/gql';
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
            DB_URL: process.env.DB_URL
        },
    },
    resources: {
        Resources: {
            LambdaSecurityGroup,
        },
        extensions: {
            // @ts-ignore
            GqlLambdaFunction: {
                Properties: {
                    TracingConfig: {
                        Mode : "Active"
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
            // @ts-ignore
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
                                            "logs:CreateLogGroup"
                                        ],
                                        "Resource": [
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-\${opt:stage, 'test'}-gql:*`
                                            },
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-worker-\${opt:stage, 'test'}-gql:*`
                                            }
                                        ]
                                    },
                                    {
                                        "Effect": "Allow",
                                        "Action": [
                                            "logs:PutLogEvents"
                                        ],
                                        "Resource": [
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-\${opt:stage, 'test'}-gql:*`
                                            },
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-\${opt:stage, 'test'}-gql:*:*`
                                            },
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-worker-\${opt:stage, 'test'}:*`
                                            },
                                            {
                                                "Fn::Sub": `arn:\${AWS::Partition}:logs:\${AWS::Region}:\${AWS::AccountId}:log-group:/aws/lambda/\${self:service,'somethingiswrong'}-worker-\${opt:stage, 'test'}:*:*`
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