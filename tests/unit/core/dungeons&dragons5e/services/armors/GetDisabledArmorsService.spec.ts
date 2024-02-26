import sinon from 'sinon';
import GetDisabledArmorsService from 'src/core/dungeons&dragons5e/services/armors/GetDisabledArmorsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledArmorsService', () => {
    let getDisabledArmorsService: GetDisabledArmorsService,
        dungeonsAndDragonsRepository: any,
        armors: any;

    const logger = (): void => {};

    context('When disabled armors are recovered with success', () => {
        before(() => {
            armors = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'armors',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => armors),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledArmorsService = new GetDisabledArmorsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const armorsTest = await getDisabledArmorsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Armors');
            expect(armorsTest).to.be.deep.equal(armors);
        });
    });
});
