import sinon from 'sinon';
import GetBackgroundService from 'src/core/dungeons&dragons5e/services/backgrounds/GetBackgroundService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetBackgroundService', () => {
    let getBackgroundService: GetBackgroundService,
        dungeonsAndDragonsRepository: any,
        background: any;

    const logger = (): void => {};

    context('When background is recovered with success', () => {
        before(() => {
            background = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'backgrounds',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => background),
                setEntity: sinon.spy(() => {}),
            };

            getBackgroundService = new GetBackgroundService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const backgroundTest = await getBackgroundService.get('ID_param');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Backgrounds'
            );
            expect(backgroundTest).to.be.deep.equal(background);
        });
    });
});
