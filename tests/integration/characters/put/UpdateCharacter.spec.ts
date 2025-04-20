import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import requester from 'tests/support/requester';
import { InjectNewCharacter, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { CharacterInstance } from 'src/domains/characters/schemas/characterPostValidationSchema';

describe('When some character is updated', () => {
    let user: UserInstance, userDetails: UserDetailInstance, character: CharacterInstance, characterId: string;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            character = CharacterDomainDataFaker.generateCharactersJSON()[0];

            characterId = character.characterId as string;

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusMustBe: InProgressStatusEnum.enum.DONE,
                nextStatusWillBe: InProgressStatusEnum.enum.DONE,
                code: '',
            };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
            await InjectNewCharacter(character);
        });

        after(() => {
            sinon.restore();
        });

        it('should return correct character created', async () => {
            const characterUpdatePayload = {
                data: {
                    ...character.data,
                    profile: {
                        name: 'test name'
                    }
                }
            };

            const { body } = await requester()
                .put(`/characters/${characterId}`)
                .send(characterUpdatePayload)
                .expect(HttpStatusCode.OK);

            expect(body).to.have.property('data');
            expect(body).to.have.property('author');
            expect(body).to.have.property('npc');
            expect(body).to.have.property('picture');
            expect(body).to.have.property('logs');
            expect(body.data).to.have.property('profile');
            expect(body.data).to.have.property('stats');
            expect(body.data).to.have.property('attacks');
            expect(body.data).to.have.property('equipments');
            expect(body.data).to.have.property('money');
            expect(body.data).to.have.property('features');
            expect(body.data.profile).to.have.property('class');
            expect(body.data.profile).to.have.property('race');
            expect(body.data.profile).to.have.property('level');
            expect(body.data.profile).to.have.property('xp');
            expect(body.data.profile).to.have.property('characteristics');
            expect(body.data.profile.name).to.be.equal('test name');
        });
    });
});
