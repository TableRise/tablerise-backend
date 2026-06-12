import sinon from 'sinon';
import UpdateCharacterService from 'src/core/characters/services/UpdateCharacterService';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';

describe('Core :: Characters :: Services :: UpdateCharacterService', () => {
    let updateCharacterService: UpdateCharacterService,
        charactersRepository: any,
        character: any,
        result: any,
        payload: any;

    const logger = (): void => {};

    context('#update', () => {
        context('When all characters are successfully updated - without props', () => {
            const createdAttest = new Date().toISOString();

            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();

                payload = {
                    data: { ...character.data },
                    createdAt: createdAttest,
                    updatedAt: createdAttest,
                };

                payload.data.profile.name = 'some name';

                result = {
                    ...character,
                    data: {
                        ...character.data,
                        profile: {
                            ...character.data.profile,
                            name: payload.data.profile.name,
                        },
                    },
                };

                charactersRepository = {
                    update: sinon.spy(() => result),
                    findOne: sinon.spy(() => character),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const charactersTest = await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });
                expect(charactersRepository.findOne).to.have.been.called();
                expect(charactersRepository.update).to.have.been.called();
                expect(charactersTest.data.profile.name).to.be.deep.equal('some name');
            });
        });

        context('When all characters are successfully updated - without props', () => {
            const createdAttest = new Date().toISOString();

            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();

                delete character.data.profile.characteristics;
                delete character.data.stats.hitPoints;
                delete character.data.stats.deathSaves;
                delete character.data.stats.spellCasting;

                payload = {
                    data: { ...character.data },
                    createdAt: createdAttest,
                    updatedAt: createdAttest,
                };

                payload.data.profile.name = 'some name';

                result = {
                    ...character,
                    data: {
                        ...character.data,
                        profile: {
                            ...character.data.profile,
                            name: payload.data.profile.name,
                        },
                    },
                };

                charactersRepository = {
                    update: sinon.spy(() => result),
                    findOne: sinon.spy(() => character),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                const charactersTest = await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });
                expect(charactersRepository.findOne).to.have.been.called();
                expect(charactersRepository.update).to.have.been.called();
                expect(charactersTest.data.profile.name).to.be.deep.equal('some name');
            });
        });

        context('When payload has no profile or stats (only money)', () => {
            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();

                payload = {
                    data: {
                        money: { cp: 0, sp: 0, ep: 0, gp: 100, pp: 0 },
                    },
                } as any;

                result = { ...character };

                charactersRepository = {
                    update: sinon.spy(() => result),
                    findOne: sinon.spy(() => character),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should call the correct methods without deep merge', async () => {
                await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });
                expect(charactersRepository.findOne).to.have.been.called();
                expect(charactersRepository.update).to.have.been.called();
            });
        });

        context('When payload has characteristics and hitPoints with missing sub-properties', () => {
            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();

                payload = {
                    data: {
                        profile: {
                            characteristics: {
                                alignment: 'neutral',
                                backstory: 'A hero',
                                personalityTraits: 'Brave',
                                ideals: 'Justice',
                                bonds: 'None',
                                flaws: 'Stubborn',
                                alliesAndOrgs: [],
                                treasure: [],
                                // intentionally omitting appearance and other to cover inner TRUE branches
                            },
                        },
                        stats: {
                            proficiencyBonus: 2,
                            inspiration: 1,
                            passiveWisdom: 2,
                            speed: 7.2,
                            initiative: 1,
                            armorClass: 15,
                            hitPoints: {
                                points: 50,
                                currentPoints: 23,
                                tempPoints: 5,
                                dicePoints: '2d10',
                            },
                            // intentionally omitting deathSaves and spellCasting to cover inner TRUE branches
                        },
                    },
                } as any;

                result = { ...character };

                charactersRepository = {
                    update: sinon.spy(() => result),
                    findOne: sinon.spy(() => character),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should call the correct methods with deep merge', async () => {
                await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });
                expect(charactersRepository.findOne).to.have.been.called();
                expect(charactersRepository.update).to.have.been.called();
            });
        });

        context('When payload has only profile characteristics (no stats)', () => {
            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();

                payload = {
                    data: {
                        profile: {
                            characteristics: {
                                alignment: 'neutral',
                                backstory: 'A hero',
                                personalityTraits: 'Brave',
                                ideals: 'Justice',
                                bonds: 'None',
                                flaws: 'Stubborn',
                                alliesAndOrgs: [],
                                treasure: [],
                            },
                        },
                    },
                } as any;

                result = { ...character };

                charactersRepository = {
                    update: sinon.spy(() => result),
                    findOne: sinon.spy(() => character),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should deep merge profile characteristics while preserving stats from db', async () => {
                await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });
                expect(charactersRepository.findOne).to.have.been.called();
                expect(charactersRepository.update).to.have.been.called();
            });
        });

        context('When character data has no profile and no stats in the database', () => {
            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();

                character.data.profile = undefined as any;
                character.data.stats = undefined as any;
                character.data.money = undefined as any;

                payload = {
                    data: {
                        profile: {
                            characteristics: {
                                alignment: 'neutral',
                            },
                        },
                        stats: {
                            proficiencyBonus: 2,
                        },
                        money: { cp: 0, sp: 0, ep: 0, gp: 10, pp: 0 },
                    },
                } as any;

                result = { ...character };

                charactersRepository = {
                    update: sinon.spy(() => result),
                    findOne: sinon.spy(() => character),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should handle undefined profile and stats gracefully', async () => {
                await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });
                expect(charactersRepository.findOne).to.have.been.called();
                expect(charactersRepository.update).to.have.been.called();
            });
        });

        context('When the character levels up', () => {
            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();
                character.data.profile.level = 4;
                character.data.profile.notificationOn = false;

                payload = {
                    data: {
                        profile: {
                            level: 5,
                        },
                    },
                } as any;

                charactersRepository = {
                    findOne: sinon.stub().returns(character),
                    update: sinon.stub().callsFake(({ payload: updatedCharacter }: any) => updatedCharacter),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should store the previous level and turn notifications on', async () => {
                const updated = await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });

                expect(updated.data.profile.level).to.equal(5);
                expect(updated.data.profile.prevLevel).to.equal(4);
                expect(updated.data.profile.notificationOn).to.equal(true);
            });
        });

        context('When the profile level does not increase', () => {
            before(() => {
                [character] = DomainDataFaker.generateCharactersJSON();
                character.data.profile.level = 4;
                character.data.profile.prevLevel = 2;
                character.data.profile.notificationOn = false;

                payload = {
                    data: {
                        profile: {
                            level: 4,
                        },
                    },
                } as any;

                charactersRepository = {
                    findOne: sinon.stub().returns(character),
                    update: sinon.stub().callsFake(({ payload: updatedCharacter }: any) => updatedCharacter),
                };

                updateCharacterService = new UpdateCharacterService({
                    charactersRepository,
                    logger,
                });
            });

            it('should preserve the existing notification fields', async () => {
                const updated = await updateCharacterService.update({
                    characterId: '112',
                    payload,
                });

                expect(updated.data.profile.prevLevel).to.equal(2);
                expect(updated.data.profile.notificationOn).to.equal(false);
            });
        });
    });
});
