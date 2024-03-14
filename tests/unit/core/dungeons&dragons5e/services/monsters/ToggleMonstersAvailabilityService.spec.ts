import sinon from 'sinon';
import ToggleMonstersAvailabilityService from 'src/core/dungeons&dragons5e/services/monsters/ToggleMonstersAvailabilityService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: ToggleMonstersAvailabilityService', () => {
    let toggleMonstersAvailabilityService: ToggleMonstersAvailabilityService,
        dungeonsAndDragonsRepository: any,
        monster: any;

    const logger = (): void => {};

    context('When monster availability is toggled with success', () => {
        before(() => {
            monster = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'monsters',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => monster[0]),
                update: sinon.spy(() => monster[0]),
                setEntity: sinon.spy(() => {}),
            };

            toggleMonstersAvailabilityService = new ToggleMonstersAvailabilityService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const monstersTest = await toggleMonstersAvailabilityService.toggle({
                id: '123',
                availability: false,
            });

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Monsters'
            );
            expect(monstersTest).to.be.deep.equal({ ...monster[0], active: false });
        });
    });
});
