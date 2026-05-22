import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import requester from 'tests/support/requester';
import { InjectNewDungeonsAndDragonsRulesRaces, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { Race } from '@tablerise/database-management/dist/src/interfaces/DungeonsAndDragons5e';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import RacesDnd from 'src/infra/data/dungeons&dragons5e/racesSeeder.json';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import DatabaseManagement from '@tablerise/database-management';

describe('When some character is created', function () {
    this.timeout(30000);

    let user: User, userDetails: UserDetail;
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

    context('And all data is correct', () => {
        const userLoggedId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
        const userLoggedDetailsId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';

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

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
            await InjectNewDungeonsAndDragonsRulesRaces(RacesDnd as unknown as Race);
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct character created and award badge_creative', async () => {
            const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: userLoggedDetailsId });
            authenticatedUserDetails.gameInfo.characters = Array.from({ length: 9 }, (_, index) => `existing-${index}`);
            authenticatedUserDetails.gameInfo.badges = [];
            await userDetailsModel.update({ userDetailId: userLoggedDetailsId }, authenticatedUserDetails);

            const characterPayload = CharacterDomainDataFaker.mocks.createCharacterMock;

            const { body } = (await requester()
                .post('/characters/create')
                .send(characterPayload)
                .expect(HttpStatusCode.CREATED)) as { body: CharactersDnd };

            expect(body).to.have.property('data');
            expect(body).to.have.property('npc');
            expect(body.npc).to.be.equal(false);
            expect(body).to.have.property('author');
            expect(body.author).to.have.property('userId');
            expect(body.author.userId).to.be.equal(userLoggedId);
            expect(body.data).to.have.property('profile');
            expect(body.data.profile).to.have.property('level');
            expect(body.data.profile).to.have.property('xp');
            expect(body.data.profile.level).to.be.equal(0);
            expect(body.data.profile.xp).to.be.equal(0);

            if (body.data.stats.abilityScores) {
                expect(body.data.stats.abilityScores[0].value).to.be.equal(1);
                expect(body.data.stats.abilityScores[1].value).to.be.equal(1);
                expect(body.data.stats.abilityScores[2].value).to.be.equal(1);
                expect(body.data.stats.abilityScores[3].value).to.be.equal(1);
                expect(body.data.stats.abilityScores[4].value).to.be.equal(1);
            }

            const { body: authenticatedUserUpdated } = await requester()
                .get(`/users/${userLoggedId}`)
                .expect(HttpStatusCode.OK);
            expect(authenticatedUserUpdated.details.gameInfo.badges).to.include('badge_creative');
        });

        it('should award badge_elder on twentieth character', async () => {
            const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: userLoggedDetailsId });
            authenticatedUserDetails.gameInfo.characters = Array.from(
                { length: 19 },
                (_, index) => `existing-${index}`
            );
            authenticatedUserDetails.gameInfo.badges = [];
            await userDetailsModel.update({ userDetailId: userLoggedDetailsId }, authenticatedUserDetails);

            const characterPayload = CharacterDomainDataFaker.mocks.createCharacterMock;

            await requester().post('/characters/create').send(characterPayload).expect(HttpStatusCode.CREATED);

            const { body: authenticatedUserUpdated } = await requester()
                .get(`/users/${userLoggedId}`)
                .expect(HttpStatusCode.OK);
            expect(authenticatedUserUpdated.details.gameInfo.badges).to.include('badge_creative');
            expect(authenticatedUserUpdated.details.gameInfo.badges).to.include('badge_elder');
        });
    });
});
