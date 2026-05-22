import inProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum, { stateFlowsKeys } from './enums/stateFlowsEnum';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import DomainsDependencies from 'src/types/modules/domains/DomainsDependencies';
import { StateMachineProps } from 'src/types/modules/domains/StateMachine';

const status = inProgressStatusEnum.enum;
const flows = stateFlowsEnum.enum;

export const StateMachineFlows = {
    [flows.UPDATE_PASSWORD]: [
        status.DONE,
        status.WAIT_TO_START_PASSWORD_CHANGE,
        status.WAIT_TO_SECOND_AUTH,
        status.WAIT_TO_FINISH_PASSWORD_CHANGE,
        status.DONE,
    ],
    [flows.CREATE_USER]: [status.WAIT_TO_CONFIRM, status.DONE],
    [flows.ACTIVATE_TWO_FACTOR]: [
        status.DONE,
        status.WAIT_TO_CONFIRM,
        status.WAIT_TO_ACTIVATE_TWO_FACTOR,
        status.WAIT_TO_SECOND_AUTH,
        status.DONE,
    ],
    [flows.RESET_TWO_FACTOR]: [
        status.DONE,
        status.WAIT_TO_START_RESET_TWO_FACTOR,
        status.WAIT_TO_FINISH_RESET_TWO_FACTOR,
        status.DONE,
    ],
    [flows.UPDATE_EMAIL]: [
        status.DONE,
        status.WAIT_TO_START_EMAIL_CHANGE,
        status.WAIT_TO_FINISH_EMAIL_CHANGE,
        status.DONE,
    ],
    [flows.RESET_PROFILE]: [status.DONE, status.WAIT_TO_RESET_PROFILE, status.DONE],
    [flows.DELETE_PROFILE]: [status.DONE, status.WAIT_TO_FINISH_DELETE_USER, status.WAIT_TO_DELETE_USER],
    [flows.DISABLE_TWO_FACTOR]: [status.DONE, status.WAIT_TO_DISABLE_TWO_FACTOR, status.DONE],
};

export default class StateMachine {
    private readonly usersRepository;
    private readonly logger;

    constructor({ usersRepository, logger }: DomainsDependencies['stateMachineContract']) {
        this.usersRepository = usersRepository;
        this.logger = logger;
    }

    public get props(): StateMachineProps {
        return {
            flows: stateFlowsEnum.enum,
            status: inProgressStatusEnum.enum,
        };
    }

    public async machine(selectedFlow: stateFlowsKeys, userToUpdate: User): Promise<User> {
        const callName = `[${this.constructor.name}] - ${this.machine.name}`;
        this.logger('info', callName);

        const flow = StateMachineFlows[selectedFlow as keyof typeof StateMachineFlows];
        const actualUserState = userToUpdate.inProgress.status;
        const actualStateFlowPosition = flow.findIndex((fl) => fl === actualUserState);
        const nextInProgress = {
            ...userToUpdate.inProgress,
            currentFlow: selectedFlow,
            status: flow[actualStateFlowPosition + 1],
            prevStatusWas: flow[actualStateFlowPosition],
            nextStatusWillBe: flow[actualStateFlowPosition + 2] ?? inProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
        };

        userToUpdate.inProgress = nextInProgress;

        return this.usersRepository.update({
            query: { userId: userToUpdate.userId },
            payload: { ...userToUpdate },
        });
    }
}
