import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

import serverlessExpress from '@vendia/serverless-express';
import app from './app';
exports.main = serverlessExpress({ app })

export const main2 = async (
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {


    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: "Go Serverless v3.0! Your function executed successfully!",
                input: event,
            },
            null,
            2
        ),
    };
};