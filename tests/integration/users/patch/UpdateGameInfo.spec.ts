import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When user game info are updated', () => {
    let user: User, userDetails: UserDetail;

    const userIdFakeOne = newUUID();
    const userIdFakeTwo = newUUID();
    const userIdFakeThree = newUUID();

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusWas: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            userDetails.gameInfo.badges = [];
            userDetails.gameInfo.campaigns = [];
            userDetails.gameInfo.characters = [];

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        context('And info is added', () => {
            it('should update the game info - badges', async () => {
                const payload = {
                    infoId: userIdFakeOne,
                    targetInfo: 'badges',
                    data: {},
                };

                const { body } = await requester()
                    .patch(`/users/${user.userId}/update/game-info/add`)
                    .send(payload)
                    .expect(HttpStatusCode.OK);

                const { body: userWithGameInfoUpdated } = await requester()
                    .get(`/users/${user.userId}`)
                    .expect(HttpStatusCode.OK);

                expect(body).to.be.equal(`ID ${userIdFakeOne} add with success to badges`);
                expect(userWithGameInfoUpdated.details.gameInfo.badges[0]).to.be.equal(userIdFakeOne);
            });

            it('should update the game info - campaigns', async () => {
                const payload = {
                    infoId: userIdFakeTwo,
                    targetInfo: 'campaigns',
                    data: {},
                };

                const { body } = await requester()
                    .patch(`/users/${user.userId}/update/game-info/add`)
                    .send(payload)
                    .expect(HttpStatusCode.OK);

                const { body: userWithGameInfoUpdated } = await requester()
                    .get(`/users/${user.userId}`)
                    .expect(HttpStatusCode.OK);

                expect(body).to.be.equal(`ID ${userIdFakeTwo} add with success to campaigns`);
                expect(userWithGameInfoUpdated.details.gameInfo.campaigns[0]).to.be.equal(userIdFakeTwo);
            });

            it('should update the game info - characters', async () => {
                const payload = {
                    infoId: userIdFakeThree,
                    targetInfo: 'characters',
                    data: {},
                };

                const { body } = await requester()
                    .patch(`/users/${user.userId}/update/game-info/add`)
                    .send(payload)
                    .expect(HttpStatusCode.OK);

                const { body: userWithGameInfoUpdated } = await requester()
                    .get(`/users/${user.userId}`)
                    .expect(HttpStatusCode.OK);

                expect(body).to.be.equal(`ID ${userIdFakeThree} add with success to characters`);
                expect(userWithGameInfoUpdated.details.gameInfo.characters[0]).to.be.equal(userIdFakeThree);
            });
        });

        context('And info is removed', () => {
            it('should remove the game info - badges', async () => {
                const payload = {
                    infoId: userIdFakeOne,
                    targetInfo: 'badges',
                    data: {},
                };

                const { body } = await requester()
                    .patch(`/users/${user.userId}/update/game-info/remove`)
                    .send(payload)
                    .expect(HttpStatusCode.OK);

                const { body: userWithGameInfoUpdated } = await requester()
                    .get(`/users/${user.userId}`)
                    .expect(HttpStatusCode.OK);

                expect(body).to.be.equal(`ID ${userIdFakeOne} remove with success to badges`);
                expect(userWithGameInfoUpdated.details.gameInfo.badges).to.have.lengthOf(0);
            });

            it('should remove the game info - campaigns', async () => {
                const payload = {
                    infoId: userIdFakeTwo,
                    targetInfo: 'campaigns',
                    data: {},
                };

                const { body } = await requester()
                    .patch(`/users/${user.userId}/update/game-info/remove`)
                    .send(payload)
                    .expect(HttpStatusCode.OK);

                const { body: userWithGameInfoUpdated } = await requester()
                    .get(`/users/${user.userId}`)
                    .expect(HttpStatusCode.OK);

                expect(body).to.be.equal(`ID ${userIdFakeTwo} remove with success to campaigns`);
                expect(userWithGameInfoUpdated.details.gameInfo.campaigns).to.have.lengthOf(0);
            });

            it('should remove the game info - characters', async () => {
                const payload = {
                    infoId: userIdFakeThree,
                    targetInfo: 'characters',
                    data: {},
                };

                const { body } = await requester()
                    .patch(`/users/${user.userId}/update/game-info/remove`)
                    .send(payload)
                    .expect(HttpStatusCode.OK);

                const { body: userWithGameInfoUpdated } = await requester()
                    .get(`/users/${user.userId}`)
                    .expect(HttpStatusCode.OK);

                expect(body).to.be.equal(`ID ${userIdFakeThree} remove with success to characters`);
                expect(userWithGameInfoUpdated.details.gameInfo.characters).to.have.lengthOf(0);
            });
        });
    });
});
