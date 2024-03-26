import sinon from 'sinon';
import GetWikiOperation from 'src/core/dungeons&dragons5e/operations/wikis/GetWikiOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetWikiOperation', () => {
    let getWikiOperation: GetWikiOperation, getWikiService: any, wiki: any;

    const logger = (): void => {};

    context('When wiki is recovered with success', () => {
        before(() => {
            wiki = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'wikis',
            });

            getWikiService = {
                get: sinon.spy(() => wiki[0]),
            };

            getWikiOperation = new GetWikiOperation({
                getWikiService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const wikiTest = await getWikiOperation.execute('123');

            expect(getWikiService.get).to.have.been.called();
            expect(wikiTest).to.be.deep.equal(wiki[0]);
        });
    });
});
