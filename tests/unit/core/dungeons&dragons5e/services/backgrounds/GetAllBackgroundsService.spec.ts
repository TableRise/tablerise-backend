import sinon from 'sinon';
import GetAllBackgroundsService from 'src/core/dungeons&dragons5e/services/backgrounds/GetAllBackgroundsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllBackgroundsService', () => {
    let getAllBackgroundsService: GetAllBackgroundsService,
        dungeonsAndDragonsRepository: any,
        backgrounds: any;

    const logger = (): void => {};

    context('When backgrounds are recovered with success', () => {
        before(() => {
            backgrounds = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'backgrounds',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => backgrounds),
                setEntity: sinon.spy(() => {}),
            };

            getAllBackgroundsService = new GetAllBackgroundsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const backgroundsTest = await getAllBackgroundsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith('Backgrounds');
            expect(backgroundsTest).to.be.deep.equal(backgrounds);
        });
    });
});
