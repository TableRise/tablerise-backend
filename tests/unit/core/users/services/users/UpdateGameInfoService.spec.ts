import getErrorName from 'src/domains/common/helpers/getErrorName';
import sinon from 'sinon';
import UpdateGameInfoService from 'src/core/users/services/users/UpdateGameInfoService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Users :: Services :: UpdateGameInfoService', () => {
    let updateGameInfoService: UpdateGameInfoService,
        usersDetailsRepository: any,
        userDetails: UserDetail,
        newUserDetails: UserDetail,
        updateGameInfoPayload: any;

    const logger = (): void => {};

    context('#add', () => {
        context('When a game info is added', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    data: {},
                    targetInfo: 'badges',
                };

                newUserDetails = {
                    ...userDetails,
                    gameInfo: {
                        ...userDetails.gameInfo,
                        badges: [infoId],
                    },
                    rank: '',
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
                await updateGameInfoService.add(updateGameInfoPayload);
                expect(usersDetailsRepository.findOne).to.have.been.called();
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: newUserDetails,
                });
            });
        });

        context('When a badge is added', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.gameInfo.badges = Array.from({ length: 9 }, (_, index) => `badge-${index}`);
                userDetails.rank = null;

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    data: {},
                    targetInfo: 'badges',
                };

                newUserDetails = {
                    ...userDetails,
                    gameInfo: {
                        ...userDetails.gameInfo,
                        badges: [...userDetails.gameInfo.badges, infoId],
                    },
                    rank: 'diamond',
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

            it('should promote rank to diamond', async () => {
                await updateGameInfoService.add(updateGameInfoPayload);

                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: newUserDetails,
                });
            });
        });

        context('When a game info is added - with data', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    data: {
                        campaignId: infoId,
                    },
                    targetInfo: 'campaigns',
                };

                newUserDetails = {
                    ...userDetails,
                    gameInfo: {
                        ...userDetails.gameInfo,
                        campaigns: [updateGameInfoPayload.data],
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
                await updateGameInfoService.add(updateGameInfoPayload);
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
                    data: {},
                    targetInfo: 'badges',
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
                    await updateGameInfoService.add(updateGameInfoPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Info already added');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
                }
            });
        });

        context('When a game info is added - but the user detail no longer exists', () => {
            before(() => {
                updateGameInfoPayload = {
                    userId: newUUID(),
                    infoId: newUUID(),
                    data: {},
                    targetInfo: 'badges',
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => null),
                    update: sinon.spy(),
                };

                updateGameInfoService = new UpdateGameInfoService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw user not found', async () => {
                try {
                    await updateGameInfoService.add(updateGameInfoPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                }
            });
        });

        context('When a game info object is added - already added', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.gameInfo.campaigns = [{ campaignId: infoId }] as any;

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    data: {
                        campaignId: infoId,
                    },
                    targetInfo: 'campaigns',
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

            it('should throw info already added', async () => {
                try {
                    await updateGameInfoService.add(updateGameInfoPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Info already added');
                    expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.BAD_REQUEST));
                }
            });
        });
    });

    context('#remove', () => {
        context('When a game info is removed', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                userDetails.gameInfo.badges = [infoId];
                userDetails.rank = 'diamond';

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    data: {},
                    targetInfo: 'badges',
                };

                newUserDetails = {
                    ...userDetails,
                    gameInfo: {
                        ...userDetails.gameInfo,
                        badges: [],
                    },
                    rank: '',
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

            it('should call correct methods and clear rank when needed', async () => {
                await updateGameInfoService.remove(updateGameInfoPayload);
                expect(usersDetailsRepository.findOne).to.have.been.called();
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: newUserDetails,
                });
            });
        });

        context('When a game info is removed - with data', () => {
            const userId = newUUID();
            const infoId = newUUID();

            before(() => {
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

                updateGameInfoPayload = {
                    userId,
                    infoId,
                    data: {
                        campaignId: infoId,
                    },
                    targetInfo: 'campaigns',
                };

                userDetails.gameInfo.campaigns = [updateGameInfoPayload.data];

                newUserDetails = {
                    ...userDetails,
                    gameInfo: {
                        ...userDetails.gameInfo,
                        campaigns: [],
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
                await updateGameInfoService.remove(updateGameInfoPayload);
                expect(usersDetailsRepository.findOne).to.have.been.called();
                expect(usersDetailsRepository.update).to.have.been.calledWith({
                    query: { userDetailId: userDetails.userDetailId },
                    payload: newUserDetails,
                });
            });
        });

        context('When a game info is removed - but the user detail no longer exists', () => {
            before(() => {
                updateGameInfoPayload = {
                    userId: newUUID(),
                    infoId: newUUID(),
                    data: {},
                    targetInfo: 'badges',
                };

                usersDetailsRepository = {
                    findOne: sinon.spy(() => null),
                    update: sinon.spy(),
                };

                updateGameInfoService = new UpdateGameInfoService({
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should throw user not found', async () => {
                try {
                    await updateGameInfoService.remove(updateGameInfoPayload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal(getErrorName(HttpStatusCode.NOT_FOUND));
                }
            });
        });
    });
});
