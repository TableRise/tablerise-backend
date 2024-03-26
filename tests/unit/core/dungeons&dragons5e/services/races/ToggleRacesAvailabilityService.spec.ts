import sinon from 'sinon';
import ToggleRacesAvailabilityService from 'src/core/dungeons&dragons5e/services/races/ToggleRacesAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleRacesAvailabilityService', () => {
    let toggleRacesAvailabilityService: ToggleRacesAvailabilityService,
        dungeonsAndDragonsRepository: any,
        race: any;

    const logger = (): void => {};

    context('When race availability is toggled with success', () => {
        before(() => {
            race = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'races',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => race[0]),
                update: sinon.spy(() => race[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleRacesAvailabilityService = new ToggleRacesAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const racesTest = await toggleRacesAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Races'
            );
            expect(racesTest).to.be.deep.equal({ ...race[0], active: false });
        });
    });
});
