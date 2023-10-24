import { Response, Request } from 'express';
import logger from '@tablerise/dynamic-logger';
import { container } from 'src/container';
import { RegisterUserPayload } from 'src/types/requests/Payload';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';

export default class UsersController {
    public async register(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('createUserOperation');
        const payload = req.body as RegisterUserPayload;

        const result = await execute(payload);
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async update(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('createUserOperation');

        const { id } = req.params;
        const payload = req.body as RegisterUserPayload;

        const result = await execute({ userId: id, payload });
        return res.status(HttpStatusCode.CREATED).json(result);
    }

    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('verifyEmailOperation');
        const { id } = req.params;
        const { email } = req.body;

        const result = await execute({ userId: id, email });
        return res.status(HttpStatusCode.NO_CONTENT).json(result);
    }

    public async getUsers(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('getUsersOperation');
        const result = await execute();
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async login(req: Request, res: Response): Promise<Response> {
        logger('info', 'Login - UsersController');
        const { user: token } = req;
        return res.status(HttpStatusCode.OK).json({ token });
    }

    public async confirmCode(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('confirmCodeOperation');
        logger('info', 'ConfirmCode - UsersController');

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

    public async delete(req: Request, res: Response): Promise<Response> {
        const { execute } = container.resolve('deleteUserOperation');

        const { id } = req.params;

        await execute(id);
        return res.status(HttpStatusCode.NO_CONTENT).end();
    }
}
