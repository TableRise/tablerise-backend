import sinon from 'sinon';
import ToggleClassesAvailabilityService from 'src/core/dungeons&dragons5e/services/classes/ToggleClassesAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleClassesAvailabilityService', () => {
    let toggleClassesAvailabilityService: ToggleClassesAvailabilityService,
        dungeonsAndDragonsRepository: any,
        _class: any;

    const logger = (): void => {};

    context('When classes are recovered with success', () => {
        before(() => {
            _class = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'classes',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => _class[0]),
                update: sinon.spy(() => _class[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleClassesAvailabilityService = new ToggleClassesAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const classesTest = await toggleClassesAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Classes'
            );
            expect(classesTest).to.be.deep.equal({ ..._class[0], active: false });
        });
    });
});
