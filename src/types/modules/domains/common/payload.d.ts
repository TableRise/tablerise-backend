import { InProgressStatusEnum } from 'src/domains/users/enums/InProgressStatusEnum';

export interface StateMachineResponse {
    status: InProgressStatusEnum;
    prevStatusWas: InProgressStatusEnum;
    nextStatusWillBe: InProgressStatusEnum;
}
