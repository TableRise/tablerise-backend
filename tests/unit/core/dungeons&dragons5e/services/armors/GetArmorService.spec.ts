import sinon from 'sinon';
import GetArmorService from 'src/core/dungeons&dragons5e/services/armors/GetArmorService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetArmorService', () => {
    let getArmorService: GetArmorService, dungeonsAndDragonsRepository: any, armor: any;

    const logger = (): void => {};

    context('When armors are recovered with success', () => {
        before(() => {
            armor = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'armors',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => armor[0]),
                setEntity: sinon.spy(() => {}),
            };

            getArmorService = new GetArmorService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const armorsTest = await getArmorService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Armors'
            );
            expect(armorsTest).to.be.deep.equal(armor[0]);
        });
    });
});
