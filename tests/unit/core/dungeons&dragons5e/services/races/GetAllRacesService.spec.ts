import sinon from 'sinon';
import GetAllRacesService from 'src/core/dungeons&dragons5e/services/races/GetAllRacesService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllRacesService', () => {
    let getAllRacesService: GetAllRacesService,
        dungeonsAndDragonsRepository: any,
        races: any;

    const logger = (): void => {};

    context('When races are recovered with success', () => {
        before(() => {
            races = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'races',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => races),
                setEntity: sinon.spy(() => {}),
            };

            getAllRacesService = new GetAllRacesService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const racesTest = await getAllRacesService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Races'
            );
            expect(racesTest).to.be.deep.equal(races);
        });
    });
});
