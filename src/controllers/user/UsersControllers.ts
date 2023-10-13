import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import UsersServices from 'src/services/user/UsersServices';
import { RegisterUserPayload } from 'src/types/Response';

export default class UsersControllers {
    constructor(
        private readonly _service: UsersServices,
        private readonly _logger: Logger
    ) {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.delete = this.delete.bind(this);
        this.resetTwoFactor = this.resetTwoFactor.bind(this);
    }

    public async register(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to register a new user');

        const payload = req.body as RegisterUserPayload;

        const request = await this._service.register(payload);
        return res.status(HttpStatusCode.CREATED).json(request);
    }

    public async login(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'User successfully logged in');

        const { user: token } = req;

        return res.status(HttpStatusCode.OK).json({
            token,
        });
    }

    public async confirmCode(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to confirm the verification code');

        const { id: _id } = req.params;
        const { code } = req.query;

        const request = await this._service.confirmCode(_id, code as string);

        return res.status(HttpStatusCode.OK).json(request);
    }

    public async verifyEmail(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        await this._service.emailVerify(id);

        return res.status(HttpStatusCode.OK).end();
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to delete a user');
        const { id: _id } = req.params;

        await this._service.delete(_id);

        return res.sendStatus(HttpStatusCode.DELETED);
    }

    public async resetTwoFactor(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { code } = req.query;

        const request = await this._service.resetTwoFactor(id, code as string);
        return res.status(HttpStatusCode.OK).json(request);
    }
}
