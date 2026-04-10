import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';
import {
    TAuthenticateSecretQuestionBody,
    TAuthenticateSecretQuestionQuery,
} from 'src/interface/users/presentation/users/UsersSchemas';

export default class AuthorizationMiddleware {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly stateMachine;
    private readonly usersSchemas;
    private readonly schemaValidator;
    private readonly twoFactorHandler;
    private readonly logger;
    private readonly ALLOWED_STATUS;

    constructor({
        schemaValidator,
        usersSchemas,
        usersRepository,
        usersDetailsRepository,
        stateMachine,
        twoFactorHandler,
        logger,
    }: InterfaceDependencies['authorizationMiddlewareContract']) {
        this.usersSchemas = usersSchemas;
        this.schemaValidator = schemaValidator;
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.stateMachine = stateMachine;
        this.twoFactorHandler = twoFactorHandler;
        this.logger = logger;

        this.ALLOWED_STATUS = [stateMachine.props.status.DONE, stateMachine.props.status.WAIT_TO_SECOND_AUTH];

        this.checkAdminRole = this.checkAdminRole.bind(this);
        this.twoFactor = this.twoFactor.bind(this);
        this.secretQuestion = this.secretQuestion.bind(this);
    }

    public async checkAdminRole(req: Request, _res: Response, next: NextFunction): Promise<void> {
        this.logger('warn', 'CheckAdminRole - AuthorizationMiddleware');

        const { userId } = req.user as Express.User;

        const userDetail = await this.usersDetailsRepository.findOne({ userId });

        if (userDetail.role === 'admin') {
            next();
        } else {
            HttpRequestErrors.throwError('unauthorized');
        }
    }

    public async twoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.logger('warn', 'TwoFactor - AuthorizationMiddleware');

        const { token, email, flow } = req.query;

        this.schemaValidator.entry(this.usersSchemas.postAuthenticate2FA.query, { email, token, flow });

        const userInDb = await this.usersRepository.findOne({ email });

        if (!this.ALLOWED_STATUS.includes(userInDb.inProgress.status))
            HttpRequestErrors.throwError('invalid-user-status');
        if (!userInDb.twoFactorSecret.active) {
            HttpRequestErrors.throwError('2fa-no-active');
        }

        const validateSecret = this.twoFactorHandler.validate({
            secret: userInDb.twoFactorSecret.secret,
            token: token as string,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        const userAuthorized = await this.stateMachine.machine(flow as stateFlowsKeys, userInDb);

        res.locals = {
            userId: userAuthorized.userId,
            userStatus: userAuthorized.inProgress.status,
            accountSecurityMethod: 'two-factor',
            lastUpdate: userAuthorized.updatedAt,
        };

        next();
    }

    public async secretQuestion(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.logger('warn', 'SecretQuestion - AuthorizationMiddleware');

        const payload = req.body as TAuthenticateSecretQuestionBody;
        const query = req.query as TAuthenticateSecretQuestionQuery;

        this.schemaValidator.entry(this.usersSchemas.postAuthenticateSecretQuestion.body, payload);
        this.schemaValidator.entry(this.usersSchemas.postAuthenticateSecretQuestion.query, query);

        const userInDb = await this.usersRepository.findOne({ email: query.email });
        const userDetailsInDb = await this.usersDetailsRepository.findOne({ userId: userInDb.userId });

        if (!userDetailsInDb.secretQuestion) {
            next();
            return;
        }

        if (!this.ALLOWED_STATUS.includes(userInDb.inProgress.status))
            HttpRequestErrors.throwError('invalid-user-status');
        if (payload.question !== userDetailsInDb.secretQuestion.question)
            HttpRequestErrors.throwError('incorrect-secret-question');
        if (payload.answer !== userDetailsInDb.secretQuestion.answer)
            HttpRequestErrors.throwError('incorrect-secret-question');

        const userAuthorized = await this.stateMachine.machine(query.flow as stateFlowsKeys, userInDb);

        res.locals = {
            userId: userAuthorized.userId,
            userStatus: userAuthorized.inProgress.status,
            accountSecurityMethod: 'secret-question',
            lastUpdate: userAuthorized.updatedAt,
        };

        next();
    }
}
