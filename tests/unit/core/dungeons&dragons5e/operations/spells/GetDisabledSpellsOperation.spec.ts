import sinon from 'sinon';
import GetDisabledSpellsOperation from 'src/core/dungeons&dragons5e/operations/spells/GetDisabledSpellsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetDisabledSpellsOperation', () => {
    let getDisabledSpellsOperation: GetDisabledSpellsOperation,
        getDisabledSpellsService: any,
        spells: any;

    const logger = (): void => {};

    context('When disabled spells are recovered with success', () => {
        before(() => {
            spells = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'spells',
            });

            getDisabledSpellsService = {
                getAllDisabled: sinon.spy(() => spells),
            };

            getDisabledSpellsOperation = new GetDisabledSpellsOperation({
                getDisabledSpellsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const spellsTest = await getDisabledSpellsOperation.execute();

            expect(getDisabledSpellsService.getAllDisabled).to.have.been.called();
            expect(spellsTest).to.be.deep.equal(spells);
        });
    });
});
