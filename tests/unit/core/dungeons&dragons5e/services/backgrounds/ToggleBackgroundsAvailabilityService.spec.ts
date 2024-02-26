import sinon from 'sinon';
import ToggleBackgroundsAvailabilityService from 'src/core/dungeons&dragons5e/services/backgrounds/ToggleBackgroundsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleBackgroundsAvailabilityService', () => {
    let toggleBackgroundsAvailabilityService: ToggleBackgroundsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        background: any;

    const logger = (): void => {};

    context('When background availability is toggled with success', () => {
        before(() => {
            background = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'backgrounds',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => background[0]),
                update: sinon.spy(() => background[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleBackgroundsAvailabilityService =
                new ToggleBackgroundsAvailabilityService({
                    dungeonsAndDragonsRepository,
                    logger,
                });
        });

        it('should return the correct data and call correct methods', async () => {
            const backgroundsTest = await toggleBackgroundsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Backgrounds'
            );
            expect(backgroundsTest).to.be.deep.equal({ ...background[0], active: false });
        });
    });
});
