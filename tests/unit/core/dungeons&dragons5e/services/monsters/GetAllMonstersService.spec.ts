import sinon from 'sinon';
import GetAllMonstersService from 'src/core/dungeons&dragons5e/services/monsters/GetAllMonstersService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetAllMonstersService', () => {
    let getAllMonstersService: GetAllMonstersService,
        dungeonsAndDragonsRepository: any,
        monsters: any;

    const logger = (): void => {};

    context('When monsters are recovered with success', () => {
        before(() => {
            monsters = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 2,
                entity: 'monsters',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => monsters),
                setEntity: sinon.spy(() => {}),
            };

            getAllMonstersService = new GetAllMonstersService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const monstersTest = await getAllMonstersService.getAll();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Monsters'
            );
            expect(monstersTest).to.be.deep.equal(monsters);
        });
    });
});
