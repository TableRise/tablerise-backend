require('dotenv').config();

module.exports = {
    // Enviroment
    node_env: process.env.NODE_ENV,

    // Database configs
    database_username: process.env.MONGODB_USERNAME,
    database_password: process.env.MONGODB_PASSWORD,
    database_host: process.env.MONGODB_HOST,
    database_database: process.env.MONGODB_DATABASE,
    database_initialString: process.env.MONGODB_CONNECTION_INITIAL,
    redis_host: process.env.REDIS_HOST,
    redis_port: process.env.REDIS_PORT,
    redis_password: process.env.REDIS_PASSWORD,

    // General configs
    twoFactorGen: {
        params: {
            label: `TableRise 2FA`,
            issuer: 'TableRise',
            encoding: 'base32',
        },
    },
    api: {
        imgur: {
            baseUrl: 'https://api.imgbb.com/1',
            authorization: `?key=${process.env.IMGBB_CLIENT_SECRET}`,
            endpoints: {
                postImage: '/upload',
            },
        },
    },
};
