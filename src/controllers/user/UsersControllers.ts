import { Request, Response } from 'express';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import { Logger } from 'src/types/Logger';
import UsersServices from 'src/services/user/UsersServices';
import { RegisterUserPayload, emailUpdatePayload } from 'src/types/Response';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { GameInfoOptions } from 'src/types/GameInfo';
import { UserSecretQuestion } from 'src/schemas/user/userDetailsValidationSchema';

export default class UsersControllers {
    constructor(
        private readonly _service: UsersServices,
        private readonly _logger: Logger
    ) {
        this.register = this.register.bind(this);
        this.login = this.login.bind(this);
        this.confirmCode = this.confirmCode.bind(this);
        this.verifyEmail = this.verifyEmail.bind(this);
        this.activateTwoFactor = this.activateTwoFactor.bind(this);
        this.updateEmail = this.updateEmail.bind(this);
        this.delete = this.delete.bind(this);
        this.updateGameInfo = this.updateGameInfo.bind(this);
        this.resetTwoFactor = this.resetTwoFactor.bind(this);
        this.updateSecretQuestion = this.updateSecretQuestion.bind(this);
        this.update = this.update.bind(this);
        this.getAll = this.getAll.bind(this);
        this.getUser = this.getUser.bind(this);
        this.activateSecretQuestion = this.activateSecretQuestion.bind(this);
        this.resetProfile = this.resetProfile.bind(this);
        this.updatePassword = this.updatePassword.bind(this);
    }

    public async updatePassword(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to update a user');
        const { id } = req.params;
        const { code } = req.query;
        const { password } = req.body;
        this._logger('info', 'prepare to update user password');
        await this._service.updatePassword(id, code as string, password as string);
        return res.status(HttpStatusCode.OK).end();
    }

    public async update(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to update a user');

        const { id } = req.params;
        const payload = req.body as RegisterUserPayload;

        const request = await this._service.update(id, payload);
        return res.status(HttpStatusCode.OK).json(request);
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

    public async activateTwoFactor(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to activate two factor authentication');
        const { id } = req.params;

        const result = await this._service.activateTwoFactor(id);
        return res.status(HttpStatusCode.OK).json(result);
    }

    public async updateEmail(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to update user email');

        const { id: _id } = req.params;
        const { code } = req.query;
        const payload = req.body as emailUpdatePayload;

        await this._service.updateEmail(_id, code as string, payload);

        return res.sendStatus(HttpStatusCode.NO_CONTENT);
    }

    public async delete(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to delete a user');
        const { id: _id } = req.params;

        await this._service.delete(_id);

        return res.sendStatus(HttpStatusCode.NO_CONTENT);
    }

    public async resetTwoFactor(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { code } = req.query;

        const request = await this._service.resetTwoFactor(id, code as string);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async updateGameInfo(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request edit users game info');
        const { id: _idUser } = req.params;
        const { id: _dataId, info: _gameInfo, operation: _operation } = req.query;

        if (!_dataId || !_gameInfo) HttpRequestErrors.throwError('query-missing');

        await this._service.updateGameInfo(
            _idUser,
            _dataId as string,
            _gameInfo as GameInfoOptions,
            _operation as string
        );

        return res.sendStatus(HttpStatusCode.OK);
    }

    public async updateSecretQuestion(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to edit user secret question');
        const { id } = req.params;
        const { code, question } = req.body;

        await this._service.updateSecretQuestion(id, code as string, question as UserSecretQuestion);

        return res.sendStatus(HttpStatusCode.OK);
    }

    public async getAll(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to get all users');

        const request = await this._service.getAll();
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async getUser(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to get user');
        const { id } = req.params;

        const request = await this._service.getUser(id);
        return res.status(HttpStatusCode.OK).json(request);
    }

    public async activateSecretQuestion(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to activate secret question');
        const { id } = req.params;
        const payload = req.body as UserSecretQuestion;

        await this._service.activateSecretQuestion(id, payload);
        return res.sendStatus(HttpStatusCode.NO_CONTENT);
    }

    public async resetProfile(req: Request, res: Response): Promise<Response> {
        this._logger('warn', 'Request to reset user profile');
        const { id } = req.params;

        await this._service.resetProfile(id);
        return res.sendStatus(HttpStatusCode.NO_CONTENT);
    }
}
