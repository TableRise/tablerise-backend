import { NextFunction, Request, Response } from 'express';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import StateMachine from 'src/domains/users/StateMachine';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';

export default class VerifyEmailCodeMiddleware {
    private readonly _usersRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        logger,
    }: InterfaceDependencies['verifyEmailCodeMiddlewareContract']) {
        this._usersRepository = usersRepository;
        this._logger = logger;

        this.verify = this.verify.bind(this);
    }

    public async verify(req: Request, res: Response, next: NextFunction): Promise<void> {
        this._logger('warn', 'Verify - VerifyEmailCodeMiddleware');

        const { id } = req.params;
        const { email, code, flow } = req.query;

        this._logger('info', `Code from Request is = ${code as string}`);
        let userInDb = {} as UserInstance;

        if (!id && !email)
            throw new HttpRequestErrors({
                message: 'Neither id or email was provided to validate the email code',
                code: HttpStatusCode.BAD_REQUEST,
                name: 'BadRequest',
            });

        if (id) userInDb = await this._usersRepository.findOne({ userId: id });
        if (email) userInDb = await this._usersRepository.findOne({ email });

        this._logger(
            'info',
            `Code in Database is = ${userInDb.inProgress.code} - status = ${userInDb.inProgress.status}`
        );

        if (code !== userInDb.inProgress.code)
            HttpRequestErrors.throwError('invalid-email-verify-code');

        userInDb.inProgress.status = StateMachine(
            flow as stateFlowsKeys,
            userInDb.inProgress.status
        );

        await this._usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });

        res.locals = {
            userId: userInDb.userId,
            userStatus: userInDb.inProgress.status,
            accountSecurityMethod: !userInDb.twoFactorSecret.active
                ? 'secret-question'
                : 'two-factor',
            lastUpdate: userInDb.updatedAt,
        };

        next();
    }
}
