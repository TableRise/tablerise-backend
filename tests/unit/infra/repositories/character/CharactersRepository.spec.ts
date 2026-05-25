import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import newUUID from 'src/domains/common/helpers/newUUID';
import CharactersRepository from 'src/infra/repositories/character/CharactersRepository';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

describe('Infra :: Repositories :: Character :: CharactersRepository', () => {
    let charactersRepository: CharactersRepository,
        updateTimestampRepository: any,
        database: any,
        serializer: any,
        character: CharactersDnd,
        query: any,
        createdCharacter: any,
        characterToCreate: any,
        characters: any,
        characterToUpdate: any;

    const logger = (): void => {};

    context('#create', () => {
        createdCharacter = DomainDataFaker.generateCharactersJSON()[0];
        const create = sinon.spy(() => createdCharacter);

        beforeEach(() => {
            characterToCreate = DomainDataFaker.mocks.createCharacterMock;

            database = {
                modelInstance: () => ({
                    create,
                }),
            };

            serializer = {
                postCharacter: (obj: any) => obj,
            };

            updateTimestampRepository = {};

            charactersRepository = new CharactersRepository({
                database,
                updateTimestampRepository,
                serializer,
                logger,
            });
        });

        it('should create an character and return serialized', async () => {
            const result = await charactersRepository.create(characterToCreate);

            expect(create).to.have.been.called();
            expect(result).to.have.property('author');
            expect(result.author.nickname).to.be.equal(createdCharacter.author.nickname);
        });
    });

    context('#findOne', () => {
        context('When a character is recovered from database', () => {
            const characterId = newUUID();

            before(() => {
                character = {
                    characterId,
                } as CharactersDnd;

                database = {
                    modelInstance: () => ({ findOne: () => character }),
                };

                serializer = {
                    postCharacter: (payload: any) => payload,
                };

                query = {
                    characterId,
                };

                updateTimestampRepository = {};

                charactersRepository = new CharactersRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                const characterTest = await charactersRepository.findOne(query);
                expect(characterTest).to.be.deep.equal(character);
            });
        });

        context('When a character belongs to a closed campaign', () => {
            const characterId = newUUID();

            before(() => {
                character = {
                    characterId,
                    campaignId: 'closed-campaign-id',
                } as CharactersDnd;

                database = {
                    modelInstance: (_scope: string, modelName: string) =>
                        modelName === 'CharactersDnd'
                            ? { findOne: () => character }
                            : modelName === 'Campaigns'
                            ? { findOne: () => ({ status: 'closed' }) }
                            : { findOne: () => null },
                };

                serializer = {
                    postCharacter: (payload: any) => payload,
                };

                query = {
                    characterId,
                };

                updateTimestampRepository = {};

                charactersRepository = new CharactersRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return null', async () => {
                const characterTest = await charactersRepository.findOne(query);
                expect(characterTest).to.equal(null);
            });
        });

        context('When a character is not recovered from database', () => {
            const characterId = newUUID();

            before(() => {
                character = {
                    characterId,
                } as CharactersDnd;

                database = {
                    modelInstance: () => ({ findOne: () => null }),
                };

                serializer = {
                    postCharacter: (payload: any) => payload,
                };

                updateTimestampRepository = {};

                charactersRepository = new CharactersRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                try {
                    await charactersRepository.findOne();
                    expect.fail('it should bot be here');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Character not found or not belongs to user');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });

    context('#find', () => {
        let findAll: sinon.SinonStub;

        beforeEach(() => {
            characters = DomainDataFaker.generateCharactersJSON({ count: 1 });
            findAll = sinon.stub().returns(characters);

            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'CharactersDnd'
                        ? { findAll }
                        : modelName === 'Campaigns'
                        ? { findOne: sinon.stub().returns({ status: 'active' }) }
                        : { findOne: sinon.stub().returns({ inProgress: { status: 'done' } }) },
            };

            serializer = {
                postCharacter: (obj: any) => obj,
            };

            charactersRepository = new CharactersRepository({
                database,
                serializer,
                updateTimestampRepository,
                logger,
            });
        });

        it('should return all characters in database', async () => {
            const charactersTest = await charactersRepository.find();
            expect(findAll).to.have.been.called();
            expect(charactersTest).to.be.deep.equal(characters);
        });

        it('should filter hidden characters', async () => {
            characters = [
                { characterId: 'character-1', campaignId: 'campaign-1', author: { userId: 'user-1' } },
                { characterId: 'character-2', campaignId: 'campaign-2', author: { userId: 'user-2' } },
            ] as CharactersDnd[];

            findAll.returns(characters);
            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'CharactersDnd'
                        ? { findAll }
                        : modelName === 'Campaigns'
                        ? {
                              findOne: sinon
                                  .stub()
                                  .callsFake(({ campaignId }) =>
                                      campaignId === 'campaign-2' ? { status: 'closed' } : { status: 'active' }
                                  ),
                          }
                        : {
                              findOne: sinon
                                  .stub()
                                  .callsFake(({ userId }) =>
                                      userId === 'user-2'
                                          ? { inProgress: { status: InProgressStatusEnum.enum.WAIT_TO_DELETE_USER } }
                                          : { inProgress: { status: 'done' } }
                                  ),
                          },
            };

            charactersRepository = new CharactersRepository({
                database,
                serializer,
                updateTimestampRepository,
                logger,
            });

            const charactersTest = await charactersRepository.find();
            expect(charactersTest).to.deep.equal([
                { characterId: 'character-1', campaignId: 'campaign-1', author: { userId: 'user-1' } },
            ]);
        });
    });
    context('#update', () => {
        context('When a character is updated', () => {
            const characterId = newUUID();

            before(() => {
                character = {
                    characterId,
                } as CharactersDnd;

                characterToUpdate = { ...character, npc: true };

                database = {
                    modelInstance: () => ({ update: () => characterToUpdate }),
                };

                serializer = {
                    postCharacter: (payload: any) => payload,
                };

                query = {
                    characterId,
                };

                characterToUpdate.createdAt = new Date().toISOString();
                characterToUpdate.updatedAt = new Date().toISOString();

                updateTimestampRepository = {
                    updateTimestamp: () => characterToUpdate,
                };

                updateTimestampRepository = { updateTimestamp: () => {} };

                charactersRepository = new CharactersRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                const characterTest = await charactersRepository.update({
                    query,
                    payload: characterToUpdate,
                });
                expect(characterTest).to.be.deep.equal(characterToUpdate);
            });
        });

        context('When a character for update is not recovered from database', () => {
            const characterId = newUUID();

            before(() => {
                character = {
                    characterId,
                } as CharactersDnd;

                database = {
                    modelInstance: () => ({ update: () => null }),
                };

                serializer = {
                    postCharacter: (payload: any) => payload,
                };

                updateTimestampRepository = {};

                charactersRepository = new CharactersRepository({
                    database,
                    updateTimestampRepository,
                    serializer,
                    logger,
                });
            });

            it('should return correct result', async () => {
                try {
                    await charactersRepository.update({
                        query: { characterId },
                        payload: character,
                    });
                    expect.fail('it should bot be here');
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('Character not found or not belongs to user');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });

    context('#delete', () => {
        it('should call delete on the model with the provided query', async () => {
            const remove = sinon.stub().resolves();
            const characterId = newUUID();

            database = {
                modelInstance: () => ({ delete: remove }),
            };

            serializer = {
                postCharacter: (payload: any) => payload,
            };

            updateTimestampRepository = {};

            charactersRepository = new CharactersRepository({
                database,
                updateTimestampRepository,
                serializer,
                logger,
            });

            await charactersRepository.delete({ characterId });

            expect(remove).to.have.been.calledWith({ characterId });
        });
    });
});
