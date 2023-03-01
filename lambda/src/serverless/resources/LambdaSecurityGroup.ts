const LambdaSecurityGroup = {
    Type: 'AWS::EC2::SecurityGroup',
    Properties: {
        GroupName: `\${self:service,'somethingiswrong'}-v2-\${opt:stage, 'test'}-lambda`,
        GroupDescription: `\${self:service,'somethingiswrong'}-v2-\${opt:stage, 'test'}-lambda`,
        VpcId: {
            "Fn::ImportValue": {
                "Fn::Sub": `\${AWS::Region}-\${opt:stage, 'test'}-VPC`
            }
        }
    }
}
export { LambdaSecurityGroup };