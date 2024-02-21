import sinon from 'sinon';
import ToggleFeatOperation from 'src/core/dungeons&dragons5e/operations/feats/ToggleFeatsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleFeatOperation', () => {
    let toggleFeatOperation: ToggleFeatOperation,
        toggleFeatsAvailabilityService: any,
        feat: any;

    const logger = (): void => {};

    context('When feat availability is toggled with success', () => {
        before(() => {
            feat = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'feats',
            });

            toggleFeatsAvailabilityService = {
                toggle: sinon.spy(() => feat[0]),
            };

            toggleFeatOperation = new ToggleFeatOperation({
                toggleFeatsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featTest = await toggleFeatOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleFeatsAvailabilityService.toggle).to.have.been.called();
            expect(featTest).to.be.deep.equal(feat[0]);
        });
    });
});
