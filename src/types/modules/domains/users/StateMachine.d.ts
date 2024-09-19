import { InProgressStatus } from 'src/domains/users/enums/InProgressStatusEnum';

export interface StateMachineFlowContract {
    updatePassword: InProgressStatus[];
}

export type StateMachineFlowKeys = keyof StateMachineFlowContract;
