import sinon from 'sinon';
import GetDisabledRealmsService from 'src/core/dungeons&dragons5e/services/realms/GetDisabledRealmsService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledRealmsService', () => {
    let getDisabledRealmsService: GetDisabledRealmsService,
        dungeonsAndDragonsRepository: any,
        realms: any;

    const logger = (): void => {};

    context('When disabled realms are recovered with success', () => {
        before(() => {
            realms = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'realms',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => realms),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledRealmsService = new GetDisabledRealmsService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const realmsTest = await getDisabledRealmsService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Realms'
            );
            expect(realmsTest).to.be.deep.equal(realms);
        });
    });
});
