import 'dotenv/config';
export default {
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
            authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID as string}`,
            endpoints: {
                postImage: '/image'
            }
        }
    }
};
