import sinon from 'sinon';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import UpdateCharacterMoneyService from 'src/core/characters/services/UpdateCharacterMoneyService';

describe('Core :: Characters :: Services :: UpdateCharacterMoneyService', () => {
    let updateCharacterMoneyService: UpdateCharacterMoneyService;
    let charactersRepository: any;
    let character: CharactersDnd;

    const logger = (): void => {};

    beforeEach(() => {
        character = CharacterDomainDataFaker.generateCharactersJSON()[0];
        character.data.money = {
            cp: 0,
            sp: 118,
            ep: 0,
            gp: 85,
            pp: 0,
        };

        charactersRepository = {
            findOne: sinon.stub().resolves(character),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        updateCharacterMoneyService = new UpdateCharacterMoneyService({
            charactersRepository,
            logger,
        } as any);
    });

    it('should add PL to pp', async () => {
        const result = await updateCharacterMoneyService.update({
            characterId: character.characterId as string,
            operation: 'add',
            money: 3,
            moneyType: 'PL',
        });

        expect(result.data.money.pp).to.equal(3);
        expect(result.data.money.sp).to.equal(118);
    });

    it('should add PP to sp', async () => {
        const result = await updateCharacterMoneyService.update({
            characterId: character.characterId as string,
            operation: 'add',
            money: 2,
            moneyType: 'PP',
        });

        expect(result.data.money.sp).to.equal(120);
        expect(result.data.money.pp).to.equal(0);
    });
});
