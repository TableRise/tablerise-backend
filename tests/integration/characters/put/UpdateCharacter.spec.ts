import sinon from 'sinon';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import requester from 'tests/support/requester';
import { InjectNewCharacter, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';

describe('When some character is updated', () => {
    let user: User, userDetails: UserDetail, character: CharactersDnd, characterId: string;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
            character = CharacterDomainDataFaker.generateCharactersJSON()[0];
            character.data.profile.level = 10;
            const constitution = character.data.stats.abilityScores.find(
                (abilityScore) => abilityScore.ability === 'Constitution'
            );

            if (constitution) {
                constitution.value = 12;
                constitution.modifier = 1;
            }

            characterId = character.characterId;

            user.inProgress = {
                status: InProgressStatusEnum.enum.DONE,
                currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
                prevStatusWas: InProgressStatusEnum.enum.DONE,
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

        it('should return correct character updated', async () => {
            const characterUpdatePayload = {
                data: {
                    ...character.data,
                    profile: {
                        name: 'test name',
                    },
                },
            };

            const { body } = await requester()
                .put(`/characters/${characterId}/update`)
                .send(characterUpdatePayload)
                .expect(HttpStatusCode.OK);

            expect(body).to.have.property('data');
            expect(body).to.have.property('author');
            expect(body).to.have.property('npc');
            expect(body).to.have.property('picture');
            expect(body).to.have.property('logs');
            expect(body.data).to.have.property('profile');
            expect(body.data).to.have.property('stats');
            expect(body.data).to.have.property('equipments');
            expect(body.data).to.have.property('money');
            expect(body.data.profile).to.have.property('class');
            expect(body.data.profile).to.have.property('race');
            expect(body.data.profile).to.have.property('level');
            expect(body.data.profile).to.have.property('xp');
            expect(body.data.profile).to.have.property('characteristics');
            expect(body.data.profile.name).to.be.equal('test name');
        });

        it('should turn notifications on when the character level increases', async () => {
            const { body } = await requester()
                .put(`/characters/${characterId}/update`)
                .send({
                    data: {
                        profile: {
                            level: 11,
                        },
                    },
                })
                .expect(HttpStatusCode.OK);

            expect(body.data.profile.level).to.equal(11);
            expect(body.data.profile.prevLevel).to.equal(10);
            expect(body.data.profile.notificationOn).to.equal(true);
            expect(body.data.profile.notificationsOn).to.equal(true);
        });

        it('should recalculate hit points when constitution modifier changes', async () => {
            const updatedAbilityScores = character.data.stats.abilityScores.map((abilityScore) =>
                abilityScore.ability === 'Constitution' ? { ...abilityScore, value: 14, modifier: 2 } : abilityScore
            );

            const { body } = await requester()
                .put(`/characters/${characterId}/update`)
                .send({
                    data: {
                        stats: {
                            abilityScores: updatedAbilityScores,
                        },
                    },
                })
                .expect(HttpStatusCode.OK);

            expect(body.data.stats.hitPoints.points).to.equal(
                character.data.stats.hitPoints.points + body.data.profile.level
            );
            expect(body.data.stats.hitPoints.currentPoints).to.equal(
                character.data.stats.hitPoints.currentPoints + body.data.profile.level
            );
            expect(body.data.stats.hitPoints.tempPoints).to.equal(character.data.stats.hitPoints.tempPoints);
            expect(body.data.stats.hitPoints.dicePoints).to.equal(character.data.stats.hitPoints.dicePoints);
        });
    });
});
