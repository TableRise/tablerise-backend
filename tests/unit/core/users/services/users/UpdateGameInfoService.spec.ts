import getErrorName from 'src/domains/common/helpers/getErrorName';
import sinon from 'sinon';
import UpdateGameInfoService from 'src/core/users/services/users/UpdateGameInfoService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: UpdateGameInfoService', () => {
    let updateGameInfoService: UpdateGameInfoService,
        usersDetailsRepository: any,
        userDetails: UserDetailInstance,
        newUserDetails: UserDetailInstance,
        updateGameInfoPayload: any;

    const logger = (): void => {};

    context('#update', () => {
        context('When a game info is added', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    targetInfo: 'badges',
                    operation: 'add',
                };

                newUserDetails = {
                    ...userDetails,
                    gameInfo: {
                        ...userDetails.gameInfo,
                        badges: [infoId],
                    },
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails),
                    update: sinon.spy(),
                };

                updateGameInfoService = new UpdateGameInfoService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                await updateGameInfoService.update(updateGameInfoPayload);
                expect(usersDetailsRepository.findOne).to.have.been.called();
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: newUserDetails,
                });
            });
        });

        context('When a game info is added - already added', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                userDetails.gameInfo.badges = [infoId];

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    targetInfo: 'badges',
                    operation: 'add',
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails),
                    update: sinon.spy(),
                };

                updateGameInfoService = new UpdateGameInfoService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                try {
                    await updateGameInfoService.update(updateGameInfoPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Info already added');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(
                        getErrorName(HttpStatusCode.BAD_REQUEST)
                    );
                }
            });
        });

        context('When a game info is removed', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                userDetails.gameInfo.badges = [infoId];

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    targetInfo: 'badges',
                    operation: 'remove',
                };

                newUserDetails = {
                    ...userDetails,
                    gameInfo: {
                        ...userDetails.gameInfo,
                        badges: [],
                    },
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => userDetails),
                    update: sinon.spy(),
                };

                updateGameInfoService = new UpdateGameInfoService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should call correct methods', async () => {
                await updateGameInfoService.update(updateGameInfoPayload);
                expect(usersDetailsRepository.findOne).to.have.been.called();
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: newUserDetails,
                });
            });
        });
    });
});
