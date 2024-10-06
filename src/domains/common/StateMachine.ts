import userStatusEnum, {
    InProgressStatus,
} from 'src/domains/users/enums/InProgressStatusEnum';
import HttpRequestErrors from './helpers/HttpRequestErrors';
import getErrorName from './helpers/getErrorName';
import { HttpStatusCode } from './helpers/HttpStatusCode';
import stateFlowsEnum, { stateFlowsKeys } from './enums/stateFlowsEnum';

const status = userStatusEnum.enum;
const flows = stateFlowsEnum.enum;

export const StateMachineProps = {
    flows: stateFlowsEnum.enum,
    status: userStatusEnum.enum,
};

export const StateMachineFlow = {
    [flows.UPDATE_PASSWORD]: [
        status.DONE,
        status.WAIT_TO_START_PASSWORD_CHANGE,
        status.WAIT_TO_SECOND_AUTH,
        status.WAIT_TO_FINISH_PASSWORD_CHANGE,
        status.DONE,
    ],
    [flows.CREATE_USER]: [status.WAIT_TO_CONFIRM, status.DONE],
    [flows.ACTIVATE_SECRET_QUESTION]: [
        status.DONE,
        status.WAIT_TO_ACTIVATE_SECRET_QUESTION,
        status.DONE,
    ],
    [flows.UPDATE_SECRET_QUESTION]: [
        status.DONE,
        status.WAIT_TO_UPDATE_SECRET_QUESTION,
        status.DONE,
    ],
    [flows.ACTIVATE_TWO_FACTOR]: [
        status.DONE,
        status.WAIT_TO_ACTIVATE_TWO_FACTOR,
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
        status.WAIT_TO_SECOND_AUTH,
        status.WAIT_TO_FINISH_EMAIL_CHANGE,
        status.DONE,
    ],
    [flows.RESET_PROFILE]: [status.DONE, status.WAIT_TO_RESET_PROFILE, status.DONE],
    [flows.DELETE_PROFILE]: [
        status.DONE,
        status.WAIT_TO_FINISH_DELETE_USER,
        status.WAIT_TO_DELETE_USER,
    ],
};

export default function StateMachine(
    flow: stateFlowsKeys,
    status: InProgressStatus
): InProgressStatus {
    const selectFlow = StateMachineFlow[flow as keyof typeof StateMachineFlow];

    if (!selectFlow.includes(status)) {
        throw new HttpRequestErrors({
            message: `Status [${status}] and flow [${flow}] are not related`,
            name: getErrorName(HttpStatusCode.BAD_REQUEST),
            code: HttpStatusCode.BAD_REQUEST,
        });
    }

    const stepIndex = selectFlow.findIndex((flowState) => flowState === status);
    return selectFlow[stepIndex + 1];
}
