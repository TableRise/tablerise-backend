import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';
import {
    TAuthenticateSecretQuestionBody,
    TAuthenticateSecretQuestionQuery,
} from 'src/interface/users/presentation/users/UsersSchemas';

export default class AuthorizationMiddleware {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _stateMachine;
    private readonly _usersSchemas;
    private readonly _schemaValidator;
    private readonly _twoFactorHandler;
    private readonly _logger;
    private readonly _ALLOWED_STATUS;

    constructor({
        schemaValidator,
        usersSchemas,
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        twoFactorHandler,
        logger,
    }: InterfaceDependencies['authorizationMiddlewareContract']) {
        this._usersSchemas = usersSchemas;
        this._schemaValidator = schemaValidator;
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._stateMachine = stateMachine;
        this._twoFactorHandler = twoFactorHandler;
        this._logger = logger;

        this._ALLOWED_STATUS = [stateMachine.props.status.DONE, stateMachine.props.status.WAIT_TO_SECOND_AUTH];

        this.checkAdminRole = this.checkAdminRole.bind(this);
        this.twoFactor = this.twoFactor.bind(this);
        this.secretQuestion = this.secretQuestion.bind(this);
    }

    public async checkAdminRole(req: Request, _res: Response, next: NextFunction): Promise<void> {
        this._logger('warn', 'CheckAdminRole - AuthorizationMiddleware');

        const { userId } = req.user as Express.User;

        const userDetail = await this._usersDetailsRepository.findOne({ userId });

        if (userDetail.role === 'admin') {
            next();
        } else {
            HttpRequestErrors.throwError('unauthorized');
        }
    }

    public async twoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
        this._logger('warn', 'TwoFactor - AuthorizationMiddleware');

        const { token, email, flow } = req.query;

        this._schemaValidator.entry(this._usersSchemas.postAuthenticate2FA.query, { email, token, flow });

        const userInDb = await this._usersRepository.findOne({ email });

        if (!this._ALLOWED_STATUS.includes(userInDb.inProgress.status))
            HttpRequestErrors.throwError('invalid-user-status');
        if (!userInDb.twoFactorSecret.active) {
            HttpRequestErrors.throwError('2fa-no-active');
        }

        const validateSecret = this._twoFactorHandler.validate({
            secret: userInDb.twoFactorSecret.secret,
            token: token as string,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        const userAuthorized = await this._stateMachine.machine(flow as stateFlowsKeys, userInDb);

        res.locals = {
            userId: userAuthorized.userId,
            userStatus: userAuthorized.inProgress.status,
            accountSecurityMethod: 'two-factor',
            lastUpdate: userAuthorized.updatedAt,
        };

        next();
    }

    public async secretQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        this._logger('warn', 'SecretQuestion - AuthorizationMiddleware');

        const payload = req.body as TAuthenticateSecretQuestionBody;
        const query = req.query as TAuthenticateSecretQuestionQuery;

        this._schemaValidator.entry(this._usersSchemas.postAuthenticateSecretQuestion.body, payload);
        this._schemaValidator.entry(this._usersSchemas.postAuthenticateSecretQuestion.query, query);

        const userInDb = await this._usersRepository.findOne({ email: query.email });
        const userDetailsInDb = await this._usersDetailsRepository.findOne({ userId: userInDb.userId });

        if (!userDetailsInDb.secretQuestion) {
            next();
            return;
        }

        if (!this._ALLOWED_STATUS.includes(userInDb.inProgress.status))
            HttpRequestErrors.throwError('invalid-user-status');
        if (payload.question !== userDetailsInDb.secretQuestion.question)
            HttpRequestErrors.throwError('incorrect-secret-question');
        if (payload.answer !== userDetailsInDb.secretQuestion.answer)
            HttpRequestErrors.throwError('incorrect-secret-question');

        const userAuthorized = await this._stateMachine.machine(query.flow as stateFlowsKeys, userInDb);

        res.locals = {
            userId: userAuthorized.userId,
            userStatus: userAuthorized.inProgress.status,
            accountSecurityMethod: 'secret-question',
            lastUpdate: userAuthorized.updatedAt,
        };

        next();
    }
}
