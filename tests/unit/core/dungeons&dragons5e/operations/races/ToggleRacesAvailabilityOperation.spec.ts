import sinon from 'sinon';
import ToggleRaceOperation from 'src/core/dungeons&dragons5e/operations/races/ToggleRacesAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleRaceOperation', () => {
    let toggleRaceOperation: ToggleRaceOperation,
        toggleRacesAvailabilityService: any,
        race: any;

    const logger = (): void => {};

    context('When race availability is toggled with success', () => {
        before(() => {
            race = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'races',
            });

            toggleRacesAvailabilityService = {
                toggle: sinon.spy(() => race[0]),
            };

            toggleRaceOperation = new ToggleRaceOperation({
                toggleRacesAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const raceTest = await toggleRaceOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleRacesAvailabilityService.toggle).to.have.been.called();
            expect(raceTest).to.be.deep.equal(race[0]);
        });
    });
});
