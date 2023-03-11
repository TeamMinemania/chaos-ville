module.exports = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        batch:{
            jobDefinition: process.env.AWS_BATCH_JOB_DEFINITION || 'arn:aws:batch:us-east-1:368590945923:job-definition/dreambooth-worker-v1-prod-us-east-1:79',
            jobQueue: process.env.AWS_BATCH_JOB_QUEUE || 'arn:aws:batch:us-east-1:368590945923:job-queue/dreambooth-worker-v1-prod-us-east-1'
        }
    },
    db: {
        host: process.env.DB_URL || 'mongodb://hello:world@localhost:27017/chaos-ville?authSource=admin'
    },
    discord: {
        appId: process.env.DISCORD_APP_ID,
        guildId: process.env.DISCORD_GUILD_ID,
        publicKey: process.env.DISCORD_PUBLIC_KEY,
        channel: '522789662419583011', //I  '477184896171900931'
    }
}