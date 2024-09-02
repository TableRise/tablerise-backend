import { NextFunction, Request, Response } from 'express';
import {
    UserDetailInstance,
    UserSecretQuestion,
} from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

export default class AuthorizationMiddleware {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _twoFactorHandler;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        twoFactorHandler,
        logger,
    }: InterfaceDependencies['authorizationMiddlewareContract']) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._twoFactorHandler = twoFactorHandler;
        this._logger = logger;

        this.checkAdminRole = this.checkAdminRole.bind(this);
        this.twoFactor = this.twoFactor.bind(this);
        this.secretQuestion = this.secretQuestion.bind(this);
    }

    public async checkAdminRole(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'CheckAdminRole - AuthorizationMiddleware');

        const { userId } = req.user as Express.User;

        const userDetail = await this._usersDetailsRepository.findOne({ userId });

        if (!userDetail) HttpRequestErrors.throwError('user-inexistent');

        if (userDetail.role === 'admin') {
            next();
        } else {
            HttpRequestErrors.throwError('unauthorized');
        }
    }

    public async twoFactor(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'TwoFactor - AuthorizationMiddleware');

        const { id } = req.params;
        const { token, email } = req.query;

        let userInDb = {} as UserInstance;

        if (id && !email) userInDb = await this._usersRepository.findOne({ userId: id });
        if (email && !userInDb.email)
            userInDb = await this._usersRepository.findOne({ email });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        if (!userInDb.twoFactorSecret.active) {
            next();
            return;
        }

        const validateSecret = this._twoFactorHandler.validate({
            secret: userInDb.twoFactorSecret.secret as string,
            token: token as string,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        next();
    }

    public async secretQuestion(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('warn', 'SecretQuestion - AuthorizationMiddleware');

        const { id } = req.params;
        const { email } = req.query || {};

        const payload = (req.body as UserSecretQuestion) || {};
        const query = (req.query as UserSecretQuestion) || {};

        let userDetailsInDb = {} as UserDetailInstance;
        let userInDb = {} as UserInstance;

        if (id)
            userDetailsInDb = await this._usersDetailsRepository.findOne({ userId: id });
        userInDb = await this._usersRepository.findOne({ userId: id });

        if (email && !id) {
            userInDb = await this._usersRepository.findOne({ email });
            userDetailsInDb = await this._usersDetailsRepository.findOne({
                userId: userInDb.userId,
            });
        }

        if (!userDetailsInDb.secretQuestion) {
            next();
            return;
        }

        const question = payload.question || query.question;
        const answer = payload.answer || query.answer;

        if (question !== userDetailsInDb.secretQuestion.question)
            HttpRequestErrors.throwError('incorrect-secret-question');
        if (answer !== userDetailsInDb.secretQuestion.answer)
            HttpRequestErrors.throwError('incorrect-secret-question');

        userInDb.inProgress.status = InProgressStatusEnum.enum.WAIT_TO_SECRET_QUESTION;

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });

        next();
    }
}
