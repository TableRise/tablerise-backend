import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import UsersServices from 'src/services/user/UsersServices';
import { RegisterUserPayload } from 'src/types/Response';

export default class UsersControllers {
    constructor(
        private readonly _service: UsersServices,
        private readonly _logger: Logger
    ) {
        this.register = this.register.bind(this);
    }

    public async register(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to register a new user');

        const payload = req.body as RegisterUserPayload;

        const request = await this._service.register(payload);
        return res.status(HttpStatusCode.CREATED).json(request);
    }
}
