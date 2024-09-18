import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { StateMachineProps } from 'src/domains/common/StateMachine';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

const FORBIDDEN_STATUS = [
    StateMachineProps.status.WAIT_TO_CONFIRM,
    StateMachineProps.status.WAIT_TO_DELETE_USER,
    StateMachineProps.status.WAIT_TO_COMPLETE
];

export default class VerifyUserMiddleware {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        logger,
    }: InterfaceDependencies['verifyUserMiddlewareContract']) {
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.userStatus = this.userStatus.bind(this);
    }

    public async userStatus(
        req: Request,
        _res: Response,
        next: NextFunction
    ): Promise<void> {
        this._logger('info', 'UserStatus - VerifyUserMiddleware');

        const { userId } = req.user as Express.User;

        const userInDb = await this._usersRepository.findOne({ userId });

        try {
            if (FORBIDDEN_STATUS.includes(userInDb.inProgress.status))
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
