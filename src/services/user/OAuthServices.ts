import { Logger } from 'src/types/Logger';

export default class OAuthServices {
    constructor(private readonly _logger: Logger) {}

    public async google(user: any): Promise<any> {
        this._logger('info', 'Registration in the database made with Google was successful');
        return user;
    }

    public async facebook(user: any): Promise<any> {
        this._logger('info', 'Registration in the database made with Facebook was successful');
        return user;
    }
}
