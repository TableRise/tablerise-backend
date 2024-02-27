import sinon from 'sinon';
import GetDisabledGodsService from 'src/core/dungeons&dragons5e/services/gods/GetDisabledGodsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledGodsService', () => {
    let getDisabledGodsService: GetDisabledGodsService,
        dungeonsAndDragonsRepository: any,
        gods: any;

    const logger = (): void => {};

    context('When disabled gods are recovered with success', () => {
        before(() => {
            gods = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'gods',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => gods),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledGodsService = new GetDisabledGodsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const godsTest = await getDisabledGodsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Gods'
            );
            expect(godsTest).to.be.deep.equal(gods);
        });
    });
});
