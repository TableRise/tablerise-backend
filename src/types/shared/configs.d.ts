export default interface Configs {
    // Enviroment
    node_env: string;

    // Database configs
    database_username: string;
    database_password: string;
    database_host: string;
    database_database: string;
    database_initialString: string;
    redis_host: string;
    redis_port: string;
    redis_password: string;

    // General configs
    twoFactorGen: {
        params: {
            label: string;
            issuer: string;
            encoding: string;
        };
    };
    api: {
        imgur: {
            baseUrl: string;
            authorization: string;
            endpoints: {
                postImage: string;
            };
        };
    };
}
