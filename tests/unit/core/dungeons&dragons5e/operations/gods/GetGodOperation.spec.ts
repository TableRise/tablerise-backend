import sinon from 'sinon';
import GetGodOperation from 'src/core/dungeons&dragons5e/operations/gods/GetGodOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetGodOperation', () => {
    let getGodOperation: GetGodOperation, getGodService: any, god: any;

    const logger = (): void => {};

    context('When god is recovered with success', () => {
        before(() => {
            god = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'gods',
            });

            getGodService = {
                get: sinon.spy(() => god[0]),
            };

            getGodOperation = new GetGodOperation({
                getGodService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const godTest = await getGodOperation.execute('123');

            expect(getGodService.get).to.have.been.called();
            expect(godTest).to.be.deep.equal(god[0]);
        });
    });
});
