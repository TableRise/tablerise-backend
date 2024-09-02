import userStatusEnum, { InProgressStatus } from 'src/domains/users/enums/InProgressStatusEnum';
import HttpRequestErrors from '../common/helpers/HttpRequestErrors';
import getErrorName from '../common/helpers/getErrorName';
import { HttpStatusCode } from '../common/helpers/HttpStatusCode';
import { StateMachineFlowKeys } from 'src/types/modules/domains/users/StateMachine';
import stateFlowsEnum from '../common/enums/stateFlowsEnum';

const status = userStatusEnum.enum;
const flows = stateFlowsEnum.enum;

export const StateMachineFlow = {
    [flows.UPDATE_PASSWORD]: [status.DONE, status.WAIT_TO_START_PASSWORD_CHANGE, status.WAIT_TO_FINISH_PASSWORD_CHANGE, status.DONE]
};

export default function StateMachine(flow: StateMachineFlowKeys, status: InProgressStatus): InProgressStatus {
    const selectFlow = StateMachineFlow[flow as keyof typeof StateMachineFlow];

    if(!selectFlow.includes(status)) {
        throw new HttpRequestErrors({
            message: `Status [${status}] and flow [${flow}] are not related`,
            name: getErrorName(HttpStatusCode.BAD_REQUEST),
            code: HttpStatusCode.BAD_REQUEST
        });
    };

    const stepIndex = selectFlow.findIndex((flowState) => flowState === status);
    const nextStep = selectFlow[stepIndex + 1];

    if(!selectFlow.includes(nextStep)) {
        throw new HttpRequestErrors({
            message: `Status [${nextStep}] and flow [${flow}] are not related`,
            name: getErrorName(HttpStatusCode.BAD_REQUEST),
            code: HttpStatusCode.BAD_REQUEST
        });
    };

    return nextStep;
} 
