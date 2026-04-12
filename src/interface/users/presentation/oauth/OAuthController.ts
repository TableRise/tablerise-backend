import Discord from 'passport-discord';
import Google from 'passport-google-oauth20';
import { Response, Request } from 'express';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { CompleteOAuthPayload } from 'src/domains/users/schemas/oAuthValidationSchema';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class OAuthController {
    private readonly googleOperation;
    private readonly discordOperation;
    private readonly completeUserOperation;
    private readonly loginUserOperation;

    constructor({
        googleOperation,
        discordOperation,
        completeUserOperation,
        loginUserOperation,
    }: InterfaceDependencies['oAuthControllerContract']) {
        this.googleOperation = googleOperation;
        this.discordOperation = discordOperation;
        this.completeUserOperation = completeUserOperation;
        this.loginUserOperation = loginUserOperation;

        this.google = this.google.bind(this);
        this.discord = this.discord.bind(this);
        this.complete = this.complete.bind(this);
    }

    public async google(req: Request, res: Response): Promise<void> {
        const { user } = req;

        const result = await this.googleOperation.execute(user as unknown as Google.Profile);

        const { cookieOptions } = await this.loginUserOperation.execute(result.token as string);

        const urlToRedirect = process.env.URL_TO_REDIRECT
            ? `${process.env.URL_TO_REDIRECT}?userId=${result.userId}`
            : 'http://localhost:3000';

        res.cookie('token', result.token, cookieOptions)
            .cookie('session', 'no-use', cookieOptions)
            .cookie('session.sig', 'no-use', cookieOptions)
            .redirect(urlToRedirect);
    }

    public async discord(req: Request, res: Response): Promise<void> {
        const { user } = req;
        const result = await this.discordOperation.execute(user as unknown as Discord.Profile);

        const { cookieOptions } = await this.loginUserOperation.execute(result.token as string);

        const urlToRedirect = process.env.URL_TO_REDIRECT
            ? `${process.env.URL_TO_REDIRECT}?userId=${result.userId}`
            : 'http://localhost:3000';

        res.cookie('token', result.token, cookieOptions)
            .cookie('session', 'no-use', cookieOptions)
            .cookie('session.sig', 'no-use', cookieOptions)
            .redirect(urlToRedirect);
    }

    public async complete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const payload = req.body as CompleteOAuthPayload;

        const result = await this.completeUserOperation.execute({ userId: id, payload });
        return res.status(HttpStatusCode.OK).json(result);
    }
}
