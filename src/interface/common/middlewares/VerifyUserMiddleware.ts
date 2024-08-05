import { NextFunction, Request, Response } from 'express';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

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

        try {
            const { userId } = req.user as Express.User;

            const userInDb = await this._usersRepository.findOne({ userId });

            if (userInDb.inProgress.status !== 'done')
                HttpRequestErrors.throwError('invalid-user-status');

            next();
        } catch (error: HttpRequestErrors | any) {
            error.details = {
                attribute: 'status',
                path: 'user.inProgress.status',
                reason: 'Wrong status - ${status atual do usuário}'
            }
        }
    }
}
