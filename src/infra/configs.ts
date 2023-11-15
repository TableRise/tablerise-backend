import 'dotenv/config';
export default {
    database_username: process.env.MONGODB_USERNAME,
    database_password: process.env.MONGODB_PASSWORD,
    database_host: process.env.MONGODB_HOST,
    database_database: process.env.MONGODB_DATABASE,
    database_initialString: process.env.MONGODB_CONNECTION_INITIAL,
    twoFactorGen: {
        params: {
            label: `TableRise 2FA`,
            issuer: 'TableRise',
            encoding: 'base32',
        }
    }
}
