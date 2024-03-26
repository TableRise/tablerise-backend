import sinon from 'sinon';
import GetSpellOperation from 'src/core/dungeons&dragons5e/operations/spells/GetSpellOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetSpellOperation', () => {
    let getSpellOperation: GetSpellOperation, getSpellService: any, spell: any;

    const logger = (): void => {};

    context('When spell is recovered with success', () => {
        before(() => {
            spell = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'spells',
            });

            getSpellService = {
                get: sinon.spy(() => spell[0]),
            };

            getSpellOperation = new GetSpellOperation({
                getSpellService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const spellTest = await getSpellOperation.execute('123');

            expect(getSpellService.get).to.have.been.called();
            expect(spellTest).to.be.deep.equal(spell[0]);
        });
    });
});
