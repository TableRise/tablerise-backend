import sinon from 'sinon';
import GetArmorOperation from 'src/core/dungeons&dragons5e/operations/armors/GetArmorOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetArmorOperation', () => {
    let getArmorOperation: GetArmorOperation, getArmorService: any, armor: any;

    const logger = (): void => {};

    context('When armors are recovered with success', () => {
        before(() => {
            armor = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'armors',
            });

            getArmorService = {
                get: sinon.spy(() => armor[0]),
            };

            getArmorOperation = new GetArmorOperation({
                getArmorService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const armorTest = await getArmorOperation.execute('123');

            expect(getArmorService.get).to.have.been.called();
            expect(armorTest).to.be.deep.equal(armor[0]);
        });
    });
});
