import 'dotenv/config';

export default (databaseName: string): string => {
    const MONGODB_USERNAME = process.env.MONGODB_USERNAME as string;
    const MONGODB_PASSWORD = process.env.MONGODB_PASSWORD as string;
    const MONGODB_HOST = process.env.MONGODB_HOST as string;
    const MONGODB_DATABASE = `${databaseName}${process.env.MONGODB_DATABASE as string}`;
    const MONGODB_CONNECTION_INITIAL = process.env.MONGODB_CONNECTION_INITIAL as string;

    const firstSection = `${MONGODB_CONNECTION_INITIAL}://${MONGODB_USERNAME}:${MONGODB_PASSWORD}`;
    const secondSection = `@${MONGODB_HOST}/${MONGODB_DATABASE}`;

    return `${firstSection}${secondSection}`;
};
