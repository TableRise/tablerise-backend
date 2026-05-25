import { NextFunction, Request, Response } from 'express';
import { stateFlowsKeys } from 'src/domains/common/enums/stateFlowsEnum';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class StateMachineFlowsMiddleware {
    private readonly usersRepository;
    private readonly stateMachine;
    private readonly logger;

    constructor({
        usersRepository,
        stateMachine,
        logger,
    }: InterfaceDependencies['stateMachineFlowsMiddlewareContract']) {
        this.usersRepository = usersRepository;
        this.stateMachine = stateMachine;
        this.logger = logger;
    }

    public async setNewFlow(req: Request, res: Response, next: NextFunction): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.setNewFlow.name}`;
        this.logger('info', callName);

        const { id } = req.params;
        const { email, flow } = req.query;

        let userInDb = {} as User;

        if (id && !email) userInDb = await this.usersRepository.findOne({ userId: id });
        if (email && !userInDb.email) userInDb = await this.usersRepository.findOne({ email });

        if (!userInDb) HttpRequestErrors.throwError('user-inexistent');

        await this.stateMachine.machine(flow as stateFlowsKeys, userInDb);
        next();
    }
}
