import Sinon from 'sinon';
import CreateCharacterOperation from 'src/core/characters/operations/CreateCharacterOperation';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';

describe('Core :: Characters :: Operations :: CreateCharacterOperation', () => {
    let createCharacterOperation: CreateCharacterOperation, createCharacterService: any, characterPayloadMock: any;

    const logger = (): any => {};

    context('When a character is created', () => {
        context('And schema has no errors', () => {
            before(() => {
                characterPayloadMock = {
                    payload: DomainDataFaker.mocks.createCharacterMock,
                    userId: '123',
                };

                createCharacterService = {
                    serialize: (obj: any) => obj.payload,
                    enrichment: Sinon.spy((obj) => obj),
                    save: (obj: any) => obj,
                    automation: (obj: any) => obj,
                };

                createCharacterOperation = new CreateCharacterOperation({
                    createCharacterService,
                    logger,
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
    });
});
