module.exports = {
    db: {
        host: process.env.DB_URL || 'mongodb://hello:world@localhost:27017/chaos-ville?authSource=admin'
    }
}