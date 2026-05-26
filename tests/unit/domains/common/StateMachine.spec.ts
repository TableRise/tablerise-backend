import sinon from 'sinon';
import StateMachine from 'src/domains/common/StateMachine';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: User :: StateMachine', () => {
    let stateMachine: StateMachine, usersRepository: any, user: any;

    const logger = (): any => {};

    context('When a flow is used in StateMachine', () => {
        context('And this flow is: update-password', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                stateMachine = new StateMachine({
                    usersRepository,
                    logger,
                });
            });

            it('should return correct next step', async () => {
                user.inProgress = {
                    status: InProgressStatusEnum.enum.DONE,
                    currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                    prevStatusWas: InProgressStatusEnum.enum.DONE,
                    nextStatusWillBe: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 1);

                user.inProgress = {
                    status: InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE,
                    currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                    prevStatusWas: InProgressStatusEnum.enum.DONE,
                    nextStatusWillBe: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 2);

                user.inProgress = {
                    status: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
                    currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                    prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_START_PASSWORD_CHANGE,
                    nextStatusWillBe: InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 3);

                user.inProgress = {
                    status: InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE,
                    currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                    prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_SECOND_AUTH,
                    nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 4);
            });
        });

        context('And this flow is: update-password - with unexpected currentFlow metadata', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                stateMachine = new StateMachine({
                    usersRepository,
                    logger,
                });
            });

            it('should advance based only on the current status', async () => {
                user.inProgress = {
                    status: InProgressStatusEnum.enum.DONE,
                    currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                    prevStatusWas: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                    nextStatusWillBe: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 1);
            });
        });

        context('And this flow is: update-password - with unexpected next status metadata', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                stateMachine = new StateMachine({
                    usersRepository,
                    logger,
                });
            });

            it('should advance based only on the current status', async () => {
                user.inProgress = {
                    status: InProgressStatusEnum.enum.DONE,
                    currentFlow: stateFlowsEnum.enum.UPDATE_PASSWORD,
                    prevStatusWas: InProgressStatusEnum.enum.DONE,
                    nextStatusWillBe: InProgressStatusEnum.enum.WAIT_TO_FINISH_PASSWORD_CHANGE,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.UPDATE_PASSWORD, user);

                sinon.assert.callCount(usersRepository.update, 1);
            });
        });

        context('And this flow is: create-user', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                usersRepository = {
                    update: sinon.spy(() => user),
                };

                stateMachine = new StateMachine({
                    usersRepository,
                    logger,
                });
            });

            it('should advance the flow until done', async () => {
                user.inProgress = {
                    status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                    currentFlow: stateFlowsEnum.enum.CREATE_USER,
                    prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                    nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.CREATE_USER, user);

                sinon.assert.callCount(usersRepository.update, 1);

                user.inProgress = {
                    status: InProgressStatusEnum.enum.DONE,
                    currentFlow: stateFlowsEnum.enum.CREATE_USER,
                    prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
                    nextStatusWillBe: InProgressStatusEnum.enum.WAIT_FOR_NEW_FLOW,
                    code: '',
                };

                await stateMachine.machine(stateFlowsEnum.enum.CREATE_USER, user);

                sinon.assert.callCount(usersRepository.update, 2);
            });
        });
    });
});
