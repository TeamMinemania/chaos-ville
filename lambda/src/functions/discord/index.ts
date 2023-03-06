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
  handler: `${handlerPath(__dirname)}/handler.main`,

  events: [
    {
      s3: {
        bucket:  {
          "Fn::ImportValue": {
            "Fn::Sub": `\${self:service,'somethingiswrong'}-\${AWS::Region}-\${opt:stage, 'test'}-OutputBucket`
          }
        },
        event: ' event: s3:ObjectCreated:*'
      },
    },
  ],
};
export { s3Worker };