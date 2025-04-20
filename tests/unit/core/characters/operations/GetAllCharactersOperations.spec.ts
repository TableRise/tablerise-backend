import sinon from 'sinon';
import GetAllCharactersOperation from 'src/core/characters/operations/GetAllCharactersOperation';

describe('Core :: Characters :: Operations :: GetAllCharactersOperation', () => {
    let getAllCharactersOperation: GetAllCharactersOperation,
        getAllCharactersService: any;

    const logger = (): void => {};

    context('#execute', () => {
        context('When all characters are successfully recovered', () => {
            before(() => {
                getAllCharactersService = {
                    getAll: sinon.spy(),
                };

                getAllCharactersOperation = new GetAllCharactersOperation({
                    getAllCharactersService,
                    logger,
                });
            });

            it('should call the correct methods', async () => {
                await getAllCharactersOperation.execute();
                expect(getAllCharactersService.getAll).to.have.been.called();
            });
        });
    });
});
