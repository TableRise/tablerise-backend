import { NextFunction, Request, Response } from 'express';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';

export default class VerifyEmailCodeMiddleware {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly stateMachine;
    private readonly usersSchemas;
    private readonly schemaValidator;
    private readonly logger;
    private readonly ALLOWED_STATUS;

    constructor({
        usersRepository,
        usersSchemas,
        usersDetailsRepository,
        stateMachine,
        schemaValidator,
        logger,
    }: InterfaceDependencies['verifyEmailCodeMiddlewareContract']) {
        this.usersRepository = usersRepository;
        this.usersSchemas = usersSchemas;
        this.usersDetailsRepository = usersDetailsRepository;
        this.stateMachine = stateMachine;
        this.schemaValidator = schemaValidator;
        this.logger = logger;

        this.ALLOWED_STATUS = [
            stateMachine.props.status.DONE,
            stateMachine.props.status.WAIT_TO_CONFIRM,
            stateMachine.props.status.WAIT_TO_START_EMAIL_CHANGE,
            stateMachine.props.status.WAIT_TO_START_PASSWORD_CHANGE,
            stateMachine.props.status.WAIT_TO_START_RESET_TWO_FACTOR,
        ];

        this.verify = this.verify.bind(this);
    }

    private async getUserToValidate(id: string, email: string): Promise<User> {
        if (!id && !email)
            throw new HttpRequestErrors({
                message: 'Neither id or email was provided to validate the email code',
                code: HttpStatusCode.BAD_REQUEST,
                name: 'BadRequest',
            });

        let user = {} as User;

        if (id) user = await this.usersRepository.findOne({ userId: id });
        if (email) user = await this.usersRepository.findOne({ email });

        if (!this.ALLOWED_STATUS.includes(user.inProgress.status)) HttpRequestErrors.throwError('invalid-user-status');

        return user;
    }

    public async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
        const callName = `[${this.constructor.name} - ${this.verify.name}]`;
        this.logger('warn', callName);

        const { id } = req.params;
        const { email, code, flow } = req.query;

        this.schemaValidator.entry(this.usersSchemas.postAuthenticateEmail.query, { email, code, flow });

        this.logger('info', `Code from Request is = ${code as string}`);

        const userValidated = await this.getUserToValidate(id, email as string);

        this.logger('info', `${callName} -> Code in Database is = ${userValidated.inProgress.code}`);
        this.logger('info', `${callName} -> User status = ${userValidated.inProgress.status}`);

        if (userValidated.inProgress.code !== code) HttpRequestErrors.throwError('invalid-email-verify-code');

        const userWithValidState = await this.stateMachine.machine(flow as stateFlowsKeys, userValidated);

        let userDetails = null;
        try {
            userDetails = await this.usersDetailsRepository.findOne({
                userId: userWithValidState.userId,
            });
        } catch (error: any) {
            if (error.code !== HttpStatusCode.NOT_FOUND) throw error;
        }

        res.locals = {
            userId: userWithValidState.userId,
            userStatus: userWithValidState.inProgress.status,
            accountSecurityMethod: !userWithValidState.twoFactorSecret.active
                ? `secret-question%${userDetails?.secretQuestion?.question as string}`
                : 'two-factor',
            lastUpdate: userWithValidState.updatedAt,
        };

        next();
    }
}
