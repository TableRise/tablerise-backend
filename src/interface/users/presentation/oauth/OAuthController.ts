import { Response, Request } from 'express';
import { container } from 'src/container';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';

export default class OAuthController {
    public async google(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('googleOperation');

        const { user } = req;

        const result = await execute(user);
        const isToken = typeof result === 'string';

        return res.status(HttpStatusCode.OK).json(isToken ? { token: result } : result);
    }

    public async facebook(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('facebookOperation');

        const { user } = req;

        const result = await execute(user);
        const isToken = typeof result === 'string';

        return res.status(HttpStatusCode.OK).json(isToken ? { token: result } : result);
    }

    public async discord(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('discordOperation');

        const { user } = req;

        const result = await execute(user);
        const isToken = typeof result === 'string';

        return res.status(HttpStatusCode.OK).json(isToken ? { token: result } : result);
    }
}
