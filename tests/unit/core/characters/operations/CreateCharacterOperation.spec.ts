import Sinon from 'sinon';
import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';

describe('Core :: Characters :: Operations :: CreateCharacterOperation', () => {
    let createCharacterOperation: CreateCharacterOperation,
    createCharacterService: any,
    schemaValidator: any,
    charactersSchema: any,
    characterPayloadMock: any;

    const logger = (): any => {};

    context('When a character is created', () => {
        context('And schema has no errors', () => {
            before(() => {
                characterPayloadMock = {
                    payload: DomainDataFaker.mocks.createCharacterMock,
                    userId: '123'
                };

                schemaValidator = {
                    entry: () => {}
                };

                createCharacterService = {
                    serialize: (obj: any) => obj.payload,
                    enrichment: Sinon.spy((obj) => obj),
                    save: (obj: any) => obj,
                };

                charactersSchema = {
                    characterPostZod: {}
                };

                createCharacterOperation = new CreateCharacterOperation({
                    schemaValidator,
                    createCharacterService,
                    charactersSchema,
                    logger
                });
            });

            it('should return correct object', async () => {
                await createCharacterOperation.execute(characterPayloadMock);
                expect(createCharacterService.enrichment).to.have.been.calledWith(
                    characterPayloadMock.payload,
                    characterPayloadMock.userId
                );
            });
        });

        context('And schema has errors', async () => {
            before(() => {
                characterPayloadMock = {
                    payload: DomainDataFaker.mocks.createCharacterMock,
                    userId: '123'
                };

                schemaValidator = {
                    entry: () => { throw new Error('Some error') }
                };

                createCharacterService = {};

                charactersSchema = {
                    characterPostZod: {}
                };

                createCharacterOperation = new CreateCharacterOperation({
                    schemaValidator,
                    createCharacterService,
                    charactersSchema,
                    logger
                });
            });

            it('should throw an error', async () => {
                try {
                    await createCharacterOperation.execute(characterPayloadMock);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    expect(error).not.to.be.undefined();
                }
            });
        });
    });
});
