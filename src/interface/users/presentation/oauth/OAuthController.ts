import Discord from 'passport-discord';
import Facebook from 'passport-facebook';
import Google from 'passport-google-oauth20';
import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { OAuthControllerContract } from 'src/types/users/contracts/presentation/oauth/OAuthController';

export default class OAuthController {
    private readonly _googleOperation;
    private readonly _facebookOperation;
    private readonly _discordOperation;

    constructor({ googleOperation, facebookOperation, discordOperation }: OAuthControllerContract) {
        this._googleOperation = googleOperation;
        this._facebookOperation = facebookOperation;
        this._discordOperation = discordOperation;

        this.google = this.google.bind(this);
        this.facebook = this.facebook.bind(this);
        this.discord = this.discord.bind(this);
    }

    public async google(req: Request, res: Response): Promise<Response> {
        const { user } = req;

        const result = await this._googleOperation.execute(user as Google.Profile);
        const isToken = typeof result === 'string';

        return res.status(HttpStatusCode.OK).json(isToken ? { token: result } : result);
    }

    public async facebook(req: Request, res: Response): Promise<Response> {
        const { user } = req;

        const result = await this._facebookOperation.execute(user as Facebook.Profile);
        const isToken = typeof result === 'string';

        return res.status(HttpStatusCode.OK).json(isToken ? { token: result } : result);
    }

    public async discord(req: Request, res: Response): Promise<Response> {
        const { user } = req;

        const result = await this._discordOperation.execute(user as Discord.Profile);
        const isToken = typeof result === 'string';

        return res.status(HttpStatusCode.OK).json(isToken ? { token: result } : result);
    }
}
