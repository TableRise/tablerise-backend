import sinon from 'sinon';
import GetDisabledWikisService from 'src/core/dungeons&dragons5e/services/wikis/GetDisabledWikisService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledWikisService', () => {
    let getDisabledWikisService: GetDisabledWikisService,
        dungeonsAndDragonsRepository: any,
        wikis: any;

    const logger = (): void => {};

    context('When disabled wikis are recovered with success', () => {
        before(() => {
            wikis = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'wikis',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => wikis),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledWikisService = new GetDisabledWikisService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const wikisTest = await getDisabledWikisService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Wikis'
            );
            expect(wikisTest).to.be.deep.equal(wikis);
        });
    });
});
