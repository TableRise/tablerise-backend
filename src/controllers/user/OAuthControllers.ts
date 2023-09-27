import Discord from 'passport-discord';
import Facebook from 'passport-facebook';
import Google from 'passport-google-oauth20';
import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import OAuthServices from 'src/services/user/OAuthServices';

export default class OAuthControllers {
    constructor(
        private readonly _service: OAuthServices,
        private readonly _logger: Logger
    ) {
        this.discord = this.discord.bind(this);
        this.google = this.google.bind(this);
        this.facebook = this.facebook.bind(this);
    }

    public async discord(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to auth with discord');

        const { user } = req;

        const request = await this._service.discord(user as Discord.Profile);
        return res.status(HttpStatusCode.CREATED).json(request);
    }

    public async google(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to auth with google');

        const { user } = req;

        const request = await this._service.google(user as Google.Profile);
        return res.status(HttpStatusCode.CREATED).json(
            typeof request === 'string'
                ? {
                      token: request,
                  }
                : request
        );
    }

    public async facebook(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to auth with facebook');

        const { user } = req;

        const request = await this._service.facebook(user as Facebook.Profile);
        return res.status(HttpStatusCode.CREATED).json(
            typeof request === 'string'
                ? {
                      token: request,
                  }
                : request
        );
    }
}
