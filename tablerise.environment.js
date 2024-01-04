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
            baseUrl: 'https://api.imgur.com/3',
            authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
            endpoints: {
                postImage: '/image',
            },
        },
    },
};
