import StateMachine from 'src/domains/common/StateMachine';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

describe('Domains :: User :: StateMachine', () => {
    context('When a flow is used in StateMachine', () => {
        context('And this flow is: update-password', () => {
            it('should return correct next step', () => {
                expect(
                    StateMachine(
                        stateFlowsEnum.enum.UPDATE_PASSWORD,
                        InProgressStatusEnum.enum.DONE
                    )
                ).to.be.equal(InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE);

                expect(
                    StateMachine(
                        stateFlowsEnum.enum.UPDATE_PASSWORD,
                        InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE
                    )
                ).to.be.equal(InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH);

                expect(
                    StateMachine(
                        stateFlowsEnum.enum.UPDATE_PASSWORD,
                        InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH
                    )
                ).to.be.equal(InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE);

                expect(
                    StateMachine(
                        stateFlowsEnum.enum.UPDATE_PASSWORD,
                        InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE
                    )
                ).to.be.equal(InProgressStatusEnum.enum.DONE);
            });

            it('should throw error when status is different of flow statuses', () => {
                const status = InProgressStatusEnum.enum.WAIT_TO_VERIFY;
                const flow = stateFlowsEnum.enum.UPDATE_PASSWORD;

                try {
                    StateMachine(flow, status);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;

                    expect(err.message).to.be.equal(
                        `Status [${status}] and flow [${flow}] are not related`
                    );
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                }
            });
        });

        context('And this flow is: create-user', () => {
            it('should return correct next step', () => {
                expect(
                    StateMachine(
                        stateFlowsEnum.enum.CREATE_USER,
                        InProgressStatusEnum.enum.WAIT_TO_CONFIRM
                    )
                ).to.be.equal(InProgressStatusEnum.enum.DONE);
            });
        });
    });
});
