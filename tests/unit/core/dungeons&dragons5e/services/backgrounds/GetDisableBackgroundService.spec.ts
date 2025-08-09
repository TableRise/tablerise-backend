import sinon from 'sinon';
import GetDisabledBackgroundsService from 'src/core/dungeons&dragons5e/services/backgrounds/GetDisabledBackgroundsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledBackgroundsService', () => {
    let getDisabledBackgroundsService: GetDisabledBackgroundsService,
        dungeonsAndDragonsRepository: any,
        background: any;

    const logger = (): void => {};

    context('When disabled backgrounds are recovered with success', () => {
        before(() => {
            background = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'backgrounds',
            });
            background.forEach((element: { active: boolean }) => {
                element.active = false;
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => background),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledBackgroundsService = new GetDisabledBackgroundsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const backgroundsTest = await getDisabledBackgroundsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Backgrounds');
            expect(backgroundsTest).to.be.deep.equal(background);
            backgroundsTest.forEach((background) => {
                expect(background.active).to.be.equal(false);
            });
        });
    });
});
