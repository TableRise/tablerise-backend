import sinon from 'sinon';
import ToggleRealmOperation from 'src/core/dungeons&dragons5e/operations/realms/ToggleRealmsAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleRealmOperation', () => {
    let toggleRealmOperation: ToggleRealmOperation,
        toggleRealmsAvailabilityService: any,
        realm: any;

    const logger = (): void => {};

    context('When realm availability is toggled with success', () => {
        before(() => {
            realm = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'realms',
            });

            toggleRealmsAvailabilityService = {
                toggle: sinon.spy(() => realm[0]),
            };

            toggleRealmOperation = new ToggleRealmOperation({
                toggleRealmsAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const realmTest = await toggleRealmOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleRealmsAvailabilityService.toggle).to.have.been.called();
            expect(realmTest).to.be.deep.equal(realm[0]);
        });
    });
});
