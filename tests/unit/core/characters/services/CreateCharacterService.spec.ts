import CreateCharacterService from 'src/core/characters/services/CreateCharacterService';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import DomainDataFakerUsers from 'src/infra/datafakers/users/DomainDataFaker';

describe('Core :: Characters :: Services :: CreateCharacterService', () => {
    let createCharacterService: CreateCharacterService,
        charactersRepository: any,
        usersRepository: any,
        usersDetailsRepository: any,
        serializer: any,
        characterPayloadMock: any,
        characterMock: any;

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

                const {
                    matchId: _,
                    campaignId: _1,
                    ...charcaterToSerialize
                } = characterMock;

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
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should serialize charcater', () => {
                const characterTest =
                    createCharacterService.serialize(characterPayloadMock);
                expect(characterTest.matchId).to.be.equal(null);
                expect(characterTest.campaignId).to.be.equal(null);
            });
        });

        context(
            'When a character is not successfully serialized - forbidden keys',
            () => {
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

                    const {
                        matchId: _,
                        campaignId: _1,
                        ...charcaterToSerialize
                    } = characterMock;

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
                        usersDetailsRepository,
                        serializer,
                        logger,
                    });
                });

                it('should throw an error', () => {
                    try {
                        createCharacterService.serialize(characterPayloadMock);
                        expect('it should not be here').to.be.equal(false);
                    } catch (error) {
                        const err = error as HttpRequestErrors;
                        expect(err.message).to.be.equal(
                            'Forbidden content was sent to save in database - check business rules'
                        );
                        expect(err.name).to.be.equal(
                            getErrorName(HttpStatusCode.BAD_REQUEST)
                        );
                        expect(err.code).to.be.equal(HttpStatusCode.BAD_REQUEST);
                    }
                });
            }
        );
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
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct props', async () => {
                const characterTest = await createCharacterService.enrichment(
                    characterMock,
                    userId
                );
                expect(characterTest).to.have.property('author');
                expect(characterTest.author).to.have.property('nickname');
                expect(characterTest.data.profile.level).to.be.equal(0);
                expect(characterTest.data.profile.xp).to.be.equal(0);
                expect(characterTest.data.stats.abilityScores).to.be.an('array');

                characterMock = characterTest;
            });
        });
    });

    context('#Save', () => {
        context('When a character enriched is saved', () => {
            before(() => {
                const userDetailsUpdated =
                    DomainDataFakerUsers.generateUserDetailsJSON()[0];

                charactersRepository = {
                    create: () => characterMock,
                };

                usersRepository = {};

                usersDetailsRepository = {
                    findOne: () => DomainDataFakerUsers.generateUserDetailsJSON()[0],
                    update: () => userDetailsUpdated,
                };

                serializer = {};

                createCharacterService = new CreateCharacterService({
                    charactersRepository,
                    usersRepository,
                    usersDetailsRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct character', async () => {
                const characterCreated = await createCharacterService.save(characterMock);
                expect(characterCreated).to.deep.equal(characterMock);
            });
        });
    });
});
