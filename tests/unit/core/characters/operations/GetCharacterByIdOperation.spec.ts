import sinon from 'sinon';
import GetCharacterByIdOperation from 'src/core/characters/operations/GetCharacterByIdOperation';
import newUUID from 'src/domains/common/helpers/newUUID';

describe('Core :: Characters :: Operations :: GetCharacterByIdOperation', () => {
    let getCharacterByIdOperation: GetCharacterByIdOperation,
        getCharacterByIdService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When a character is successfully recovered', () => {
            const characterId = newUUID();

            before(() => {
                getCharacterByIdService = {
                    get: sinon.spy(),
                };

                getCharacterByIdOperation = new GetCharacterByIdOperation({
                    getCharacterByIdService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await getCharacterByIdOperation.execute(characterId);
                expect(getCharacterByIdService.get).to.have.been.called();
            });
        });
    });
});
