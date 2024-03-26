import sinon from 'sinon';
import GetMonsterService from 'src/core/dungeons&dragons5e/services/monsters/GetMonsterService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetMonsterService', () => {
    let getMonsterService: GetMonsterService,
        dungeonsAndDragonsRepository: any,
        monster: any;

    const logger = (): void => {};

    context('When monster is recovered with success', () => {
        before(() => {
            monster = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'monsters',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => monster[0]),
                setEntity: sinon.spy(() => {}),
            };

            getMonsterService = new GetMonsterService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const monstersTest = await getMonsterService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Monsters'
            );
            expect(monstersTest).to.be.deep.equal(monster[0]);
        });
    });
});
