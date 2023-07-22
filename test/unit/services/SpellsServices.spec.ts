import SpellsModel from 'src/database/models/SpellsModel';
import SpellsServices from 'src/services/SpellsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Spell } from 'src/schemas/spellsValidationSchema';
import mocks from 'src/support/mocks';

describe('Services :: SpellsServices', () => {
  const SpellsModelMock = new SpellsModel();
  const SpellsServicesMock = new SpellsServices(SpellsModelMock);
  const spellMockInstance = mocks.spell.instance as Internacional<Spell>;
  const { _id: _, ...spellMockPayload } = spellMockInstance;

  describe('When the recover all spells service is called', () => {
    beforeAll(() => {
      jest.spyOn(SpellsModelMock, 'findAll').mockResolvedValue([spellMockInstance])
    });

    it('should return correct data', async () => {
      const responseTest = await SpellsServicesMock.findAll();
      expect(responseTest).toStrictEqual([spellMockInstance]);
    });
  });

  describe('When the recover a spell by ID service is called', () => {
    beforeAll(() => {
      jest.spyOn(SpellsModelMock, 'findOne').mockResolvedValueOnce(spellMockInstance)
        .mockResolvedValue(null);
    });

    it('should return correct data when ID valid', async () => {
      const responseTest = await SpellsServicesMock.findOne(spellMockInstance._id as string);
      expect(responseTest).toBe(spellMockInstance);
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await SpellsServicesMock.findOne('inexistent_id');
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a spell with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });

  describe('When service for update a spell is called', () => {
    const spellMockID = spellMockInstance._id as string;
    const spellMockUpdateInstance = {
      en: { ...spellMockInstance.en, name: 'None' },
      pt: { ...spellMockInstance.pt, name: 'None' }
    };

    const { name: _1, ...spellsMockEnWithoutName } = spellMockPayload.en;
    const { name: _2, ...spellsMockPtWithoutName } = spellMockPayload.pt;
    const spellMockPayloadWrong = {
      en: spellsMockEnWithoutName,
      pt: spellsMockPtWithoutName
    };

    beforeAll(() => {
      jest.spyOn(SpellsModelMock, 'update').mockResolvedValueOnce(spellMockUpdateInstance)
        .mockResolvedValue(null);
    });

    it('should return correct data with updated values', async () => {
      const responseTest = await SpellsServicesMock.update(spellMockID, spellMockPayload as Internacional<Spell>);
      expect(responseTest).toBe(spellMockUpdateInstance);
    });

    it('should throw an error when payload is incorrect', async () => {
      try {
        await SpellsServicesMock.update(spellMockID, spellMockPayloadWrong as Internacional<Spell>);
      } catch (error) {
        const err = error as Error;
        expect(JSON.parse(err.message)[0].path).toStrictEqual(['en', 'name']);
        expect(JSON.parse(err.message)[0].message).toBe('Required');
        expect(err.stack).toBe('422');
        expect(err.name).toBe('ValidationError');
      }
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await SpellsServicesMock.update('inexistent_id', spellMockPayload as Internacional<Spell>);
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a spell with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });

  describe('When service for delete a spell is called', () => {
    const spellMockID = spellMockInstance._id as string;

    beforeAll(() => {
      jest.spyOn(SpellsModelMock, 'findOne').mockResolvedValueOnce(spellMockInstance)
        .mockResolvedValue(null);

      jest.spyOn(SpellsModelMock, 'delete').mockResolvedValue(null);
    });

    it('should delete spell and not return any data', async () => {
      try {
        await SpellsServicesMock.delete(spellMockID);
      } catch (error) {
        fail('it should not reach here')
      }
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await SpellsServicesMock.delete('inexistent_id');
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a spell with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });
});
