import { Logger } from "src/types/Logger";

export default class OAuthServices {
    constructor(
        private readonly _logger: Logger
    ) {};

    public async google(user: any): Promise<any> {
        this._logger('info', 'Register in database made with success through google');
        return user;
    }
}
