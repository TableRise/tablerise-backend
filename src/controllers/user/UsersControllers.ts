import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import UsersServices from 'src/services/user/UsersServices';
import { RegisterUserPayload } from 'src/types/Response';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import getErrorName from 'src/support/helpers/getErrorName';

export default class UsersControllers {
    constructor(
        private readonly _service: UsersServices,
        private readonly _logger: Logger
    ) {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
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

        if (typeof code !== 'string') {
            throw new HttpRequestErrors({
                message: 'Query must be a string',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });
        }
        const request = await this._service.confirmCode(_id, code);

        return res.status(HttpStatusCode.OK).json(request);
    }
}
