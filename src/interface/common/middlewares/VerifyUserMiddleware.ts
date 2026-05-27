import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class VerifyUserMiddleware {
    private readonly usersRepository;
    private readonly stateMachine;
    private readonly logger;
    private readonly FORBIDDEN_STATUS;

    constructor({ usersRepository, stateMachine, logger }: InterfaceDependencies['verifyUserMiddlewareContract']) {
        this.usersRepository = usersRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;

        this.FORBIDDEN_STATUS = [
            this.stateMachine.props.status.WAIT_TO_CONFIRM,
            this.stateMachine.props.status.WAIT_TO_DELETE_USER,
            this.stateMachine.props.status.WAIT_TO_COMPLETE,
        ];

        this.userStatus = this.userStatus.bind(this);
    }

    public async userStatus(req: Request, _res: Response, next: NextFunction): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.userStatus.name}`;
        this.logger('info', callName);

        const { userId } = req.user as Express.User;

        const userInDb = await this.usersRepository.findOne({ userId });
        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        try {
            if (this.FORBIDDEN_STATUS.includes(userInDb.inProgress.status))
                HttpRequestErrors.throwError('invalid-user-status');

            next();
        } catch (error: HttpRequestErrors | any) {
            error.details = {
                attribute: 'status',
                path: userInDb.inProgress.status,
                reason: `Wrong status - ${userInDb.inProgress.status}`,
            };

            throw error;
        }
    }
}
