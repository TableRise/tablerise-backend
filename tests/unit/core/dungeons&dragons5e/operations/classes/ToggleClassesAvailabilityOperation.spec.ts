import sinon from 'sinon';
import ToggleClassOperation from 'src/core/dungeons&dragons5e/operations/classes/ToggleClassesAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleClassOperation', () => {
    let toggleClassOperation: ToggleClassOperation,
        toggleClassesAvailabilityService: any,
        _class: any;

    const logger = (): void => {};

    context('When classes are recovered with success', () => {
        before(() => {
            _class = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'classes',
            });

            toggleClassesAvailabilityService = {
                toggle: sinon.spy(() => _class[0]),
            };

            toggleClassOperation = new ToggleClassOperation({
                toggleClassesAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const classTest = await toggleClassOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleClassesAvailabilityService.toggle).to.have.been.called();
            expect(classTest).to.be.deep.equal(_class[0]);
        });
    });
});
