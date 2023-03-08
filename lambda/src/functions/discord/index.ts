import schema from './schema';
import { handlerPath } from '../../libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.main`,

  events: [
    {
      http: {
        method: 'any',
        path: '/discord/{proxy+}',
        request: {
          /*schemas: {
            'application/json': schema,
          },*/
        },
      },
    },
  ],
};
const s3Worker =  {
  handler: `${handlerPath(__dirname)}/handler.s3Worker`,

  events: [
    {
      s3: {
        bucket:  {
          "Fn::ImportValue": {
            "Fn::Sub": `dreambooth-worker-v1-\${AWS::Region}-\${opt:stage, 'test'}-OutputBucket`
          }
        },
        existing: true,
        event: 's3:ObjectCreated:*',
        rules:[
          {
            suffix: '.jpg'
          }
        ]
      },
    },
  ],
};
export { s3Worker };