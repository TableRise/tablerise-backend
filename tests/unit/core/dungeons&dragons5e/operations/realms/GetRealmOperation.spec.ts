import sinon from 'sinon';
import GetRealmOperation from 'src/core/dungeons&dragons5e/operations/realms/GetRealmOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetRealmOperation', () => {
    let getRaceOperation: GetRealmOperation, getRealmService: any, race: any;

    const logger = (): void => {};

    context('When race is recovered with success', () => {
        before(() => {
            race = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'realms',
            });

            getRealmService = {
                get: sinon.spy(() => race[0]),
            };

            getRaceOperation = new GetRealmOperation({
                getRealmService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const raceTest = await getRaceOperation.execute('123');

            expect(getRealmService.get).to.have.been.called();
            expect(raceTest).to.be.deep.equal(race[0]);
        });
    });
});
