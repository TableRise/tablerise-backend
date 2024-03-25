import sinon from 'sinon';
import GetDisabledMonstersOperation from 'src/core/dungeons&dragons5e/operations/monsters/GetDisabledMonstersOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledMonstersOperation', () => {
    let getDisabledMonstersOperation: GetDisabledMonstersOperation,
        getDisabledMonstersService: any,
        monsters: any;

    const logger = (): void => {};

    context('When disabled monsters are recovered with success', () => {
        before(() => {
            monsters = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'monsters',
            });

            getDisabledMonstersService = {
                getAllDisabled: sinon.spy(() => monsters),
            };

            getDisabledMonstersOperation = new GetDisabledMonstersOperation({
                getDisabledMonstersService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const monstersTest = await getDisabledMonstersOperation.execute();

            expect(getDisabledMonstersService.getAllDisabled).to.have.been.called();
            expect(monstersTest).to.be.deep.equal(monsters);
        });
    });
});
