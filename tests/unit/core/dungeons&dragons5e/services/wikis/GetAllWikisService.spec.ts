import sinon from 'sinon';
import GetAllWikisService from 'src/core/dungeons&dragons5e/services/wikis/GetAllWikisService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllWikisService', () => {
    let getAllWikisService: GetAllWikisService,
        dungeonsAndDragonsRepository: any,
        wikis: any;

    const logger = (): void => {};

    context('When wikis are recovered with success', () => {
        before(() => {
            wikis = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'wikis',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => wikis),
                setEntity: sinon.spy(() => {}),
            };

            getAllWikisService = new GetAllWikisService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const wikisTest = await getAllWikisService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Wikis'
            );
            expect(wikisTest).to.be.deep.equal(wikis);
        });
    });
});
