import sinon from 'sinon';
import GetWikiService from 'src/core/dungeons&dragons5e/services/wikis/GetWikiService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetWikiService', () => {
    let getWikiService: GetWikiService, dungeonsAndDragonsRepository: any, wiki: any;

    const logger = (): void => {};

    context('When wiki is recovered with success', () => {
        before(() => {
            wiki = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'wikis',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => wiki[0]),
                setEntity: sinon.spy(() => {}),
            };

            getWikiService = new GetWikiService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const wikisTest = await getWikiService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Wikis'
            );
            expect(wikisTest).to.be.deep.equal(wiki[0]);
        });
    });
});
