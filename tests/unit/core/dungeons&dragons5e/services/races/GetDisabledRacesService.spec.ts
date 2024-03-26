import sinon from 'sinon';
import GetDisabledRacesService from 'src/core/dungeons&dragons5e/services/races/GetDisabledRacesService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledRacesService', () => {
    let getDisabledRacesService: GetDisabledRacesService,
        dungeonsAndDragonsRepository: any,
        races: any;

    const logger = (): void => {};

    context('When disabled races are recovered with success', () => {
        before(() => {
            races = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'races',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => races),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledRacesService = new GetDisabledRacesService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const racesTest = await getDisabledRacesService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Races'
            );
            expect(racesTest).to.be.deep.equal(races);
        });
    });
});
