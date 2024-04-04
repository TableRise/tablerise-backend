import sinon from 'sinon';
import GetMonsterOperation from 'src/core/dungeons&dragons5e/operations/monsters/GetMonsterOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Operations :: GetMonsterOperation', () => {
    let getMonsterOperation: GetMonsterOperation, getMonsterService: any, monster: any;

    const logger = (): void => {};

    context('When monster is recovered with success', () => {
        before(() => {
            monster = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'monsters',
            });

            getMonsterService = {
                get: sinon.spy(() => monster[0]),
            };

            getMonsterOperation = new GetMonsterOperation({
                getMonsterService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const monsterTest = await getMonsterOperation.execute('123');

            expect(getMonsterService.get).to.have.been.called();
            expect(monsterTest).to.be.deep.equal(monster[0]);
        });
    });
});
