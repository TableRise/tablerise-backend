import sinon from 'sinon';
import ToggleGodsAvailabilityService from 'src/core/dungeons&dragons5e/services/gods/ToggleGodsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleGodsAvailabilityService', () => {
    let toggleGodsAvailabilityService: ToggleGodsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        gods: any;

    const logger = (): void => {};

    context('When gods availability is toggled with success', () => {
        before(() => {
            gods = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'gods',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => gods[0]),
                update: sinon.spy(() => gods[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleGodsAvailabilityService = new ToggleGodsAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const GodsTest = await toggleGodsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Gods'
            );
            expect(GodsTest).to.be.deep.equal({ ...gods[0], active: false });
        });
    });
});
