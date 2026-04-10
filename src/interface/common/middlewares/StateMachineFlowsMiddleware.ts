import { NextFunction, Request, Response } from 'express';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class StateMachineFlowsMiddleware {
    private readonly usersRepository;
    private readonly logger;

    constructor({ usersRepository, logger }: InterfaceDependencies['stateMachineFlowsMiddlewareContract']) {
        this.usersRepository = usersRepository;
        this.logger = logger;
    }

    public async setNewFlow(req: Request, res: Response, next: NextFunction): Promise<void> {
        this.logger('warn', 'SetNewFlow - StateMachineFlowsMiddleware');

        const { id } = req.params;
        const { email, flow } = req.query;

        let userInDb = {} as User;

        if (id && !email) userInDb = await this.usersRepository.findOne({ userId: id });
        if (email && !userInDb.email) userInDb = await this.usersRepository.findOne({ email });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        userInDb.inProgress.currentFlow = flow as stateFlowsKeys;

        await this.usersRepository.update({
            query: { userId: userInDb.userId },
            payload: userInDb,
        });
    }
}
