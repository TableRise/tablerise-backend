import sinon from 'sinon';
import GetRealmService from 'src/core/dungeons&dragons5e/services/realms/GetRealmService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetRealmService', () => {
    let getRealmService: GetRealmService, dungeonsAndDragonsRepository: any, race: any;

    const logger = (): void => {};

    context('When race is recovered with success', () => {
        before(() => {
            race = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'realms',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => race[0]),
                setEntity: sinon.spy(() => {}),
            };

            getRealmService = new GetRealmService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const realmsTest = await getRealmService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Realms'
            );
            expect(realmsTest).to.be.deep.equal(race[0]);
        });
    });
});
