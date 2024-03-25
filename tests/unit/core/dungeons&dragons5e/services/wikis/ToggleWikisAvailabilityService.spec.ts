import sinon from 'sinon';
import ToggleWikisAvailabilityService from 'src/core/dungeons&dragons5e/services/wikis/ToggleWikisAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleWikisAvailabilityService', () => {
    let toggleWikisAvailabilityService: ToggleWikisAvailabilityService,
        dungeonsAndDragonsRepository: any,
        wiki: any;

    const logger = (): void => {};

    context('When wiki availability is toggled with success', () => {
        before(() => {
            wiki = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'wikis',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => wiki[0]),
                update: sinon.spy(() => wiki[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleWikisAvailabilityService = new ToggleWikisAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const wikisTest = await toggleWikisAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Wikis'
            );
            expect(wikisTest).to.be.deep.equal({ ...wiki[0], active: false });
        });
    });
});
