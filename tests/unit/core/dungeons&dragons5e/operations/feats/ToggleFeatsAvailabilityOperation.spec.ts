import sinon from 'sinon';
import ToggleFeatsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/feats/ToggleFeatsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleFeatsAvailabilityOperation', () => {
    let toggleFeatsAvailabilityOperation: ToggleFeatsAvailabilityOperation,
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

            toggleFeatsAvailabilityOperation = new ToggleFeatsAvailabilityOperation({
                toggleFeatsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featTest = await toggleFeatsAvailabilityOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleFeatsAvailabilityService.toggle).to.have.been.called();
            expect(featTest).to.be.deep.equal(feat[0]);
        });
    });
});
