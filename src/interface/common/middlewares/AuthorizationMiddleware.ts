import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';

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
    }

    public async checkAdminRole(req: Request, _res: Response, next: NextFunction): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.checkAdminRole.name}`;
        this.logger('info', callName);

        const { userId } = req.user as Express.User;

        const userDetail = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetail) HttpRequestErrors.throwError('user-inexistent');

        if (userDetail.role === 'admin') {
            next();
        } else {
            HttpRequestErrors.throwError('unauthorized');
        }
    }

    public async twoFactor(req: Request, res: Response, next: NextFunction): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.twoFactor.name}`;
        this.logger('info', callName);

        const { token, email, flow } = req.query;

        this.schemaValidator.entry(this.usersSchemas.postAuthenticate2FA.query, { email, token, flow });

        const userInDb = await this.usersRepository.findOne({ email });
        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

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
}
