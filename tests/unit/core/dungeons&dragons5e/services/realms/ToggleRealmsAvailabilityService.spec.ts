import sinon from 'sinon';
import ToggleRealmsAvailabilityService from 'src/core/dungeons&dragons5e/services/realms/ToggleRealmsAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleRealmsAvailabilityService', () => {
    let toggleRealmsAvailabilityService: ToggleRealmsAvailabilityService,
        dungeonsAndDragonsRepository: any,
        realm: any;

    const logger = (): void => {};

    context('When realm availability is toggled with success', () => {
        before(() => {
            realm = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'realms',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => realm[0]),
                update: sinon.spy(() => realm[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleRealmsAvailabilityService = new ToggleRealmsAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const realmsTest = await toggleRealmsAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Realms'
            );
            expect(realmsTest).to.be.deep.equal({ ...realm[0], active: false });
        });
    });
});
