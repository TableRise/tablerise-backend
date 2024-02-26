import sinon from 'sinon';
import GetAllArmorsService from 'src/core/dungeons&dragons5e/services/armors/GetAllArmorsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllArmorsService', () => {
    let getAllArmorsService: GetAllArmorsService, dungeonsAndDragonsRepository: any, armors: any;

    const logger = (): void => {};

    context('When armors are recovered with success', () => {
        before(() => {
            armors = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'armors',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => armors),
                setEntity: sinon.spy(() => {}),
            };

            getAllArmorsService = new GetAllArmorsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const armorsTest = await getAllArmorsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Armors');
            expect(armorsTest).to.be.deep.equal(armors);
        });
    });
});
