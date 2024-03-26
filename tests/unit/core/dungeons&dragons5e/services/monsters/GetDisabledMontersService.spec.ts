import sinon from 'sinon';
import GetDisabledMonstersService from 'src/core/dungeons&dragons5e/services/monsters/GetDisabledMonstersService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&dragons5e :: Service :: GetDisabledMonstersService', () => {
    let getDisabledMonstersService: GetDisabledMonstersService,
        dungeonsAndDragonsRepository: any,
        monsters: any;

    const logger = (): void => {};

    context('When disabled monsters are recovered with success', () => {
        before(() => {
            monsters = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'monsters',
            });

            dungeonsAndDragonsRepository = {
                find: sinon.spy(() => monsters),
                setEntity: sinon.spy(() => {}),
            };

            getDisabledMonstersService = new GetDisabledMonstersService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const monstersTest = await getDisabledMonstersService.getAllDisabled();

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Monsters'
            );
            expect(monstersTest).to.be.deep.equal(monsters);
        });
    });
});
