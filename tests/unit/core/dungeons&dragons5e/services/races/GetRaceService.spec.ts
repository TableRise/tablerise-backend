import sinon from 'sinon';
import GetRaceService from 'src/core/dungeons&dragons5e/services/races/GetRaceService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetRaceService', () => {
    let getRaceService: GetRaceService, dungeonsAndDragonsRepository: any, race: any;

    const logger = (): void => {};

    context('When race is recovered with success', () => {
        before(() => {
            race = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'races',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => race[0]),
                setEntity: sinon.spy(() => {}),
            };

            getRaceService = new GetRaceService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const racesTest = await getRaceService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Races'
            );
            expect(racesTest).to.be.deep.equal(race[0]);
        });
    });
});
