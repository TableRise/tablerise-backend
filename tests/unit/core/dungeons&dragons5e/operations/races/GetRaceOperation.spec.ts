import sinon from 'sinon';
import GetRaceOperation from 'src/core/dungeons&dragons5e/operations/races/GetRaceOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetRaceOperation', () => {
    let getRaceOperation: GetRaceOperation, getRaceService: any, race: any;

    const logger = (): void => {};

    context('When race is recovered with success', () => {
        before(() => {
            race = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'races',
            });

            getRaceService = {
                get: sinon.spy(() => race[0]),
            };

            getRaceOperation = new GetRaceOperation({
                getRaceService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const raceTest = await getRaceOperation.execute('123');

            expect(getRaceService.get).to.have.been.called();
            expect(raceTest).to.be.deep.equal(race[0]);
        });
    });
});
