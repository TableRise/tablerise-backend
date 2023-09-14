import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import OAuthServices from 'src/services/user/OAuthServices';

export default class OAuthControllers {
    constructor(
        private readonly _service: OAuthServices,
        private readonly _logger: Logger
    ) {
        this.google = this.google.bind(this);
        this.facebook = this.facebook.bind(this);
    }

    public async google(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to auth with google');

        const { user } = req;

        const request = await this._service.google(user);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async facebook(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to auth with facebook');

        const { user } = req;

        const request = await this._service.facebook(user);
        return res.status(HttpStatusCode.OK).json(request);
    }
}
