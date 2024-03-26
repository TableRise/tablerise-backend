import sinon from 'sinon';
import ToggleGodsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/gods/ToggleGodsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleGodsAvailabilityOperation', () => {
    let toggleGodsAvailabilityOperation: ToggleGodsAvailabilityOperation,
        toggleGodsAvailabilityService: any,
        feat: any;

    const logger = (): void => {};

    context('When gods availability is toggled with success', () => {
        before(() => {
            feat = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'gods',
            });

            toggleGodsAvailabilityService = {
                toggle: sinon.spy(() => feat[0]),
            };

            toggleGodsAvailabilityOperation = new ToggleGodsAvailabilityOperation({
                toggleGodsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featTest = await toggleGodsAvailabilityOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleGodsAvailabilityService.toggle).to.have.been.called();
            expect(featTest).to.be.deep.equal(feat[0]);
        });
    });
});
