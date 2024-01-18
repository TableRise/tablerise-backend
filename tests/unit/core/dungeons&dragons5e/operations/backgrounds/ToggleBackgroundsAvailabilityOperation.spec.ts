import sinon from 'sinon';
import ToggleBackgroundOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/ToggleBackgroundsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleBackgroundOperation', () => {
    let toggleBackgroundOperation: ToggleBackgroundOperation,
        toggleBackgroundsAvailabilityService: any,
        background: any;

    const logger = (): void => {};

    context('When backgrounds are recovered with success', () => {
        before(() => {
            background = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'backgrounds',
            });

            toggleBackgroundsAvailabilityService = {
                toggle: sinon.spy(() => background[0]),
            };

            toggleBackgroundOperation = new ToggleBackgroundOperation({
                toggleBackgroundsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const backgroundTest = await toggleBackgroundOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleBackgroundsAvailabilityService.toggle).to.have.been.called();
            expect(backgroundTest).to.be.deep.equal(background[0]);
        });
    });
});
