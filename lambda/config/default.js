module.exports = {
    aws: {
        region: process.env.AWS_REGION || 'us-east-1',
        batch:{
            jobDefinition: process.env.AWS_BATCH_JOB_DEFINITION || 'arn:aws:batch:us-east-1:368590945923:job-definition/dreambooth-worker-v1-prod-us-east-1:54',
            jobQueue: process.env.AWS_BATCH_JOB_QUEUE || 'arn:aws:batch:us-east-1:368590945923:job-queue/dreambooth-worker-v1-prod-us-east-1'
        }
    },
    db: {
        host: process.env.DB_URL || 'mongodb://hello:world@localhost:27017/chaos-ville?authSource=admin'
    },
    discord: {
        publicKey: process.env.DISCORD_PUBLIC_KEY
    }
}