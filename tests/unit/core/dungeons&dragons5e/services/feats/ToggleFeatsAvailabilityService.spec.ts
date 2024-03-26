import sinon from 'sinon';
import ToggleFeatsAvailabilityService from 'src/core/dungeons&dragons5e/services/feats/ToggleFeatsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleFeatsAvailabilityService', () => {
    let toggleFeatsAvailabilityService: ToggleFeatsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        feat: any;

    const logger = (): void => {};

    context('When feat availability is toggled with success', () => {
        before(() => {
            feat = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'feats',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => feat[0]),
                update: sinon.spy(() => feat[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleFeatsAvailabilityService = new ToggleFeatsAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const featsTest = await toggleFeatsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Feats'
            );
            expect(featsTest).to.be.deep.equal({ ...feat[0], active: false });
        });
    });
});
