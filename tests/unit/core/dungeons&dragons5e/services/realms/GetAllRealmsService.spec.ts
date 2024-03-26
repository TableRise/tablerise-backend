import sinon from 'sinon';
import GetAllRealmsService from 'src/core/dungeons&dragons5e/services/realms/GetAllRealmsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllRealmsService', () => {
    let getAllRaealmsService: GetAllRealmsService,
        dungeonsAndDragonsRepository: any,
        realms: any;

    const logger = (): void => {};

    context('When realms are recovered with success', () => {
        before(() => {
            realms = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'realms',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => realms),
                setEntity: sinon.spy(() => {}),
            };

            getAllRaealmsService = new GetAllRealmsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const realmsTest = await getAllRaealmsService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Realms'
            );
            expect(realmsTest).to.be.deep.equal(realms);
        });
    });
});
