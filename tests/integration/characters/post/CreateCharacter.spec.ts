import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import requester from 'tests/support/requester';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

describe('When some character is created', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        const userLoggedId = '12cd093b-0a8a-42fe-910f-001f2ab28454';

        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct character created', async () => {
            const characterPayload = CharacterDomainDataFaker.mocks.createCharacterMock;

            const { body } = await requester()
                .post('/characters/create')
                .send(characterPayload)
                .expect(HttpStatusCode.CREATED);

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
        });
    });
});
