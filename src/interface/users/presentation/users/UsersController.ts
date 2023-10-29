import { Response, Request } from 'express';
import { container } from 'src/container';
import { RegisterUserPayload } from 'src/types/users/requests/Payload';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';

export default class UsersController {
    public async register(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('createUserOperation');
        const payload = req.body as RegisterUserPayload;

        const result = await execute(payload);
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('updateUserOperation');

        const { id } = req.params;
        const payload = req.body as RegisterUserPayload;

        const result = await execute({ userId: id, payload });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('verifyEmailOperation');

        const { email, newEmail } = req.query;

        const result = await execute({ email, newEmail });
        return res.status(HttpStatusCode.NO_CONTENT).json(result);
    }

    public async getUsers(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('getUsersOperation');
        const result = await execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async getUserById(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('getUserByIdOperation');

        const { id } = req.params;

        const result = await execute({ userId: id });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async login(req: Request, res: Response): Promise<Response> {
        const { user: token } = req;
        return res.status(HttpStatusCode.OK).json({ token });
    }

    public async confirmCode(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('confirmCodeOperation');

        const { id } = req.params;
        const { code } = req.query;

        const result = await execute({ userId: id, code });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async activateTwoFactor(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('activateTwoFactorOperation');

        const { id } = req.params;

        const result = await execute(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async resetTwoFactor(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('resetTwoFactorOperation');

        const { id } = req.params;
        const { code } = req.query;

        const result = await execute({ userId: id, code });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateEmail(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('updateEmailOperation');

        const { id } = req.params;
        const { code } = req.query;
        const { email } = req.body;

        const result = await execute({ userId: id, code, email });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateGameInfo(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('updateGameInfoOperation');

        const { id } = req.params;
        const { infoId, targetInfo, operation } = req.query;

        const result = await execute({ userId: id, infoId, targetInfo, operation });
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async resetProfile(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('resetProfileOperation');

        const { id } = req.params;

        await execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('deleteUserOperation');

        const { id } = req.params;

        await execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
