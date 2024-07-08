import sinon from 'sinon';
import ToggleMonsterOperation from 'src/core/dungeons&dragons5e/operations/monsters/ToggleMonstersAvailabilityOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: ToggleMonsterOperation', () => {
    let toggleMonsterOperation: ToggleMonsterOperation,
        toggleMonstersAvailabilityService: any,
        monster: any;

    const logger = (): void => {};

    context('When monster availability is toggled with success', () => {
        before(() => {
            monster = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'monsters',
            });

            toggleMonstersAvailabilityService = {
                toggle: sinon.spy(() => monster[0]),
            };

            toggleMonsterOperation = new ToggleMonsterOperation({
                toggleMonstersAvailabilityService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const monsterTest = await toggleMonsterOperation.execute({
                id: '123',
                availability: false,
            });

            expect(toggleMonstersAvailabilityService.toggle).to.have.been.called();
            expect(monsterTest).to.be.deep.equal(monster[0]);
        });
    });
});
