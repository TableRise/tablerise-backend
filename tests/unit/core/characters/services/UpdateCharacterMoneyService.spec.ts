import sinon from 'sinon';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import UpdateCharacterMoneyService from 'src/core/characters/services/UpdateCharacterMoneyService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

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

    it('should subtract money without going below zero', async () => {
        const result = await updateCharacterMoneyService.update({
            characterId: character.characterId as string,
            operation: 'subtract',
            money: 999,
            moneyType: 'PO',
        });

        expect(result.data.money.gp).to.equal(0);
    });

    it('should reject unsupported money types', async () => {
        try {
            await updateCharacterMoneyService.update({
                characterId: character.characterId as string,
                operation: 'add',
                money: 1,
                moneyType: 'INVALID' as any,
            });
            expect.fail('Expected invalid query string error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('Query must be a string');
            expect(err.code).to.equal(HttpStatusCode.UNPROCESSABLE_ENTITY);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.UNPROCESSABLE_ENTITY));
        }
    });

    it('should keep the current value when the operation is neither add nor subtract', async () => {
        const result = await updateCharacterMoneyService.update({
            characterId: character.characterId as string,
            operation: 'noop' as any,
            money: 999,
            moneyType: 'PC',
        });

        expect(result.data.money.cp).to.equal(0);
    });

    it('should treat non-number wallet values as zero before updating', async () => {
        character.data.money.pp = 'legacy' as any;

        const result = await updateCharacterMoneyService.update({
            characterId: character.characterId as string,
            operation: 'add',
            money: 2,
            moneyType: 'PL',
        });

        expect(result.data.money.pp).to.equal(2);
    });
});
