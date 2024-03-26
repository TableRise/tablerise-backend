import sinon from 'sinon';
import ToggleWikiOperation from 'src/core/dungeons&dragons5e/operations/wikis/ToggleWikisAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleWikiOperation', () => {
    let toggleWikiOperation: ToggleWikiOperation,
        toggleWikisAvailabilityService: any,
        wiki: any;

    const logger = (): void => {};

    context('When wiki availability is toggled with success', () => {
        before(() => {
            wiki = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'wikis',
            });

            toggleWikisAvailabilityService = {
                toggle: sinon.spy(() => wiki[0]),
            };

            toggleWikiOperation = new ToggleWikiOperation({
                toggleWikisAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const wikiTest = await toggleWikiOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleWikisAvailabilityService.toggle).to.have.been.called();
            expect(wikiTest).to.be.deep.equal(wiki[0]);
        });
    });
});
