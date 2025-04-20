import Sinon from 'sinon';
import UpdateCharacterOperation from 'src/core/characters/operations/UpdateCharacterOperation';

describe('Core :: Characters :: Operations :: UpdateCharacterOperation', () => {
    let updateCharacterOperation: UpdateCharacterOperation,
        charactersSchema: any,
        schemaValidator: any,
        payloadToUpdate: any,
        updateCharacterService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When character are successfully updated', () => {
            before(() => {
                updateCharacterService = {
                    update: Sinon.spy(),
                };

                payloadToUpdate = {
                    characterId: '123',
                    payload: {},
                };

                charactersSchema = {};

                schemaValidator = { entry: Sinon.spy() };

                updateCharacterOperation = new UpdateCharacterOperation({
                    updateCharacterService,
                    charactersSchema,
                    schemaValidator,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await updateCharacterOperation.execute(payloadToUpdate);
                expect(updateCharacterService.update).to.have.been.called();
            });
        });
    });
});
