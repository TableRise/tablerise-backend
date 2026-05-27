import CreateCharacterService from 'src/core/characters/services/CreateCharacterService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import DomainDataFakerUsers from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Characters :: Services :: CreateCharacterService', () => {
    let createCharacterService: CreateCharacterService,
        charactersRepository: any,
        dungeonsAndDragonsRepository: any,
        usersRepository: any,
        usersDetailsRepository: any,
        serializer: any,
        characterPayloadMock: any,
        characterMock: any,
        userDetailsUpdated: any;

    const logger = (): void => {};

    context('#Serialize', () => {
        context('When a character is successfully serialized', () => {
            before(() => {
                characterMock = DomainDataFaker.generateCharactersJSON()[0];
                characterPayloadMock = DomainDataFaker.mocks.createCharacterMock;

                characterMock.matchId = null;
                characterMock.campaignId = null;

                charactersRepository = {
                    create: () => characterMock,
                };

                usersRepository = {};
                usersDetailsRepository = {};

                const { matchId: _, campaignId: _1, ...charcaterToSerialize } = characterMock;

                charcaterToSerialize.matchId = null;
                charcaterToSerialize.campaignId = null;

                delete charcaterToSerialize.data.profile.level;
                delete charcaterToSerialize.data.profile.xp;
                delete charcaterToSerialize.data.stats.abilityScores;
                delete charcaterToSerialize.data.stats.deathSaves;
                delete charcaterToSerialize.data.money;
                delete charcaterToSerialize.data.spells;

                serializer = {
                    postCharacter: () => charcaterToSerialize,
                };

                createCharacterService = new CreateCharacterService({
                    charactersRepository,
                    usersRepository,
                    dungeonsAndDragonsRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should serialize charcater', () => {
                const characterTest = createCharacterService.serialize(characterPayloadMock);
                expect(characterTest.matchId).to.be.equal(null);
                expect(characterTest.campaignId).to.be.equal(null);
            });
        });

        context('When a character payload has no data property', () => {
            before(() => {
                characterPayloadMock = DomainDataFaker.mocks.createCharacterMock;

                serializer = {
                    postCharacter: () => ({}),
                };

                createCharacterService = new CreateCharacterService({
                    charactersRepository,
                    usersRepository,
                    dungeonsAndDragonsRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should serialize without error when data is absent', () => {
                const characterTest = createCharacterService.serialize(characterPayloadMock);
                expect(characterTest).to.deep.equal({});
            });
        });

        context('When a character is serialized with a permissive serializer payload', () => {
            before(() => {
                characterMock = DomainDataFaker.generateCharactersJSON()[0];
                characterPayloadMock = DomainDataFaker.mocks.createCharacterMock;

                characterMock.matchId = null;
                characterMock.campaignId = null;

                charactersRepository = {
                    create: () => characterMock,
                };

                usersRepository = {};
                usersDetailsRepository = {};

                const { matchId: _, campaignId: _1, ...charcaterToSerialize } = characterMock;

                charcaterToSerialize.matchId = null;
                charcaterToSerialize.campaignId = null;

                delete charcaterToSerialize.data.profile.level;
                delete charcaterToSerialize.data.profile.xp;
                delete charcaterToSerialize.data.stats.abilityScores;
                delete charcaterToSerialize.data.stats.deathSaves;
                delete charcaterToSerialize.data.money;

                serializer = {
                    postCharacter: () => charcaterToSerialize,
                };

                createCharacterService = new CreateCharacterService({
                    charactersRepository,
                    usersRepository,
                    dungeonsAndDragonsRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should return the serializer output as-is', () => {
                const characterTest = createCharacterService.serialize(characterPayloadMock);
                expect(characterTest.data).to.not.have.property('money');
                expect(characterTest.data).to.have.property('spells');
            });
        });
    });

    context('#Enrichment', () => {
        context('When a serialized character is successfully enriched', () => {
            const userId = newUUID();

            before(() => {
                characterMock = DomainDataFaker.mocks.createCharacterMock;

                characterMock.matchId = null;
                characterMock.campaignId = null;

                charactersRepository = {};
                usersRepository = {
                    findOne: () => DomainDataFakerUsers.generateUsersJSON()[0],
                };
                usersDetailsRepository = {
                    findOne: () => DomainDataFakerUsers.generateUserDetailsJSON()[0],
                };
                serializer = {};

                createCharacterService = new CreateCharacterService({
                    charactersRepository,
                    usersRepository,
                    dungeonsAndDragonsRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct props', async () => {
                const characterTest = await createCharacterService.enrichment(characterMock, userId);
                expect(characterTest).to.have.property('author');
                expect(characterTest.author).to.have.property('nickname');
                expect(characterTest.data.profile.characteristics.appearance.picture).to.equal(null);
                expect(characterTest.logs).to.be.an('array').that.is.not.empty;
                expect(characterTest.picture).to.have.property('link');

                characterMock = characterTest;
            });
        });

        it('should reject when the user or user details do not exist', async () => {
            characterMock = DomainDataFaker.mocks.createCharacterMock;

            createCharacterService = new CreateCharacterService({
                charactersRepository: {},
                usersRepository: {
                    findOne: () => null,
                },
                dungeonsAndDragonsRepository,
                usersDetailsRepository: {
                    findOne: () => null,
                },
                serializer: {},
                logger,
            } as any);

            let thrownError;

            try {
                await createCharacterService.enrichment(characterMock, newUUID());
            } catch (error) {
                thrownError = error;
            }

            expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        });
    });

    context('#Save', () => {
        context('When a character enriched is saved', () => {
            before(() => {
                characterMock = DomainDataFaker.generateCharactersJSON()[0];
                characterMock.author = { userId: newUUID(), nickname: 'tester', fullname: 'Test User' };
                userDetailsUpdated = DomainDataFakerUsers.generateUserDetailsJSON()[0];
                userDetailsUpdated.gameInfo.characters = Array.from({ length: 9 }, (_, index) => `existing-${index}`);
                userDetailsUpdated.gameInfo.badges = [];

                charactersRepository = {
                    create: () => characterMock,
                };

                usersRepository = {};

                usersDetailsRepository = {
                    findOne: () => userDetailsUpdated,
                    update: () => userDetailsUpdated,
                };

                serializer = {};

                createCharacterService = new CreateCharacterService({
                    charactersRepository,
                    usersRepository,
                    dungeonsAndDragonsRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct character', async () => {
                const characterCreated = await createCharacterService.save(characterMock);
                expect(characterCreated).to.deep.equal(characterMock);
                expect(userDetailsUpdated.gameInfo.badges).to.deep.equal([]);
            });
        });

        context('When the twentieth character is saved', () => {
            before(() => {
                characterMock = DomainDataFaker.generateCharactersJSON()[0];
                characterMock.author = { userId: newUUID(), nickname: 'tester', fullname: 'Test User' };
                userDetailsUpdated = DomainDataFakerUsers.generateUserDetailsJSON()[0];
                userDetailsUpdated.gameInfo.characters = Array.from({ length: 19 }, (_, index) => `existing-${index}`);
                userDetailsUpdated.gameInfo.badges = [];

                charactersRepository = {
                    create: () => characterMock,
                };

                usersRepository = {};

                usersDetailsRepository = {
                    findOne: () => userDetailsUpdated,
                    update: () => userDetailsUpdated,
                };

                serializer = {};

                createCharacterService = new CreateCharacterService({
                    charactersRepository,
                    usersRepository,
                    dungeonsAndDragonsRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should not award character badges automatically', async () => {
                await createCharacterService.save(characterMock);

                expect(userDetailsUpdated.gameInfo.badges).to.deep.equal([]);
            });
        });

        it('should reject when user details are missing on save', async () => {
            characterMock = DomainDataFaker.generateCharactersJSON()[0];
            characterMock.author = { userId: newUUID(), nickname: 'tester', fullname: 'Test User' };

            createCharacterService = new CreateCharacterService({
                charactersRepository: {
                    create: () => characterMock,
                },
                usersRepository: {},
                dungeonsAndDragonsRepository,
                usersDetailsRepository: {
                    findOne: () => null,
                },
                serializer: {},
                logger,
            } as any);

            let thrownError;

            try {
                await createCharacterService.save(characterMock);
            } catch (error) {
                thrownError = error;
            }

            expect(thrownError).to.be.instanceOf(HttpRequestErrors);
        });
    });
});
