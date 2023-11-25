import Discord from 'passport-discord';
import Facebook from 'passport-facebook';
import Google from 'passport-google-oauth20';
import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { OAuthControllerContract } from 'src/types/users/contracts/presentation/oauth/OAuthController';
import { CompleteOAuthPayload } from 'src/domains/user/schemas/oAuthValidationSchema';

export default class OAuthController {
    private readonly _googleOperation;
    private readonly _facebookOperation;
    private readonly _discordOperation;
    private readonly _completeUserOperation;

    constructor({
        googleOperation,
        facebookOperation,
        discordOperation,
        completeUserOperation,
    }: OAuthControllerContract) {
        this._googleOperation = googleOperation;
        this._facebookOperation = facebookOperation;
        this._discordOperation = discordOperation;
        this._completeUserOperation = completeUserOperation;

        this.google = this.google.bind(this);
        this.facebook = this.facebook.bind(this);
        this.discord = this.discord.bind(this);
        this.complete = this.complete.bind(this);
    }

    public async google(req: Request, res: Response): Promise<Response> {
        const { user } = req;

        const result = await this._googleOperation.execute(user as Google.Profile);
        const isToken = typeof result === 'string';

        return res
            .status(HttpStatusCode.CREATED)
            .json(isToken ? { token: result } : result);
    }

    public async facebook(req: Request, res: Response): Promise<Response> {
        const { user } = req;

        const result = await this._facebookOperation.execute(user as Facebook.Profile);
        const isToken = typeof result === 'string';

        return res
            .status(HttpStatusCode.CREATED)
            .json(isToken ? { token: result } : result);
    }

    public async discord(req: Request, res: Response): Promise<Response> {
        const { user } = req;

        const result = await this._discordOperation.execute(user as Discord.Profile);
        const isToken = typeof result === 'string';

        return res
            .status(HttpStatusCode.CREATED)
            .json(isToken ? { token: result } : result);
    }

    public async complete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as CompleteOAuthPayload;

        const result = await this._completeUserOperation.execute({ userId: id, payload });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
