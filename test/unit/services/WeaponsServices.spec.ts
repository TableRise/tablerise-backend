import WeaponsModel from 'src/database/models/WeaponsModel';
import WeaponsServices from 'src/services/WeaponsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Weapon } from 'src/schemas/weaponsValidationSchema';
import mocks from 'src/support/mocks';

describe('Services :: WeaponsServices', () => {
  const WeaponsModelMock = new WeaponsModel();
  const WeaponsServicesMock = new WeaponsServices(WeaponsModelMock);
  const weaponMockInstance = mocks.weapon.instance as Internacional<Weapon>;
  const { _id: _, ...weaponMockPayload } = weaponMockInstance;

  describe('When the recover all weapons service is called', () => {
    beforeAll(() => {
      jest.spyOn(WeaponsModelMock, 'findAll').mockResolvedValue([weaponMockInstance])
    });

    it('should return correct data', async () => {
      const responseTest = await WeaponsServicesMock.findAll();
      expect(responseTest).toStrictEqual([weaponMockInstance]);
    });
  });

  describe('When the recover a weapon by ID service is called', () => {
    beforeAll(() => {
      jest.spyOn(WeaponsModelMock, 'findOne').mockResolvedValueOnce(weaponMockInstance)
        .mockResolvedValue(null);
    });

    it('should return correct data when ID valid', async () => {
      const responseTest = await WeaponsServicesMock.findOne(weaponMockInstance._id as string);
      expect(responseTest).toBe(weaponMockInstance);
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await WeaponsServicesMock.findOne('inexistent_id');
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a weapon with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });

  describe('When service for update a weapon is called', () => {
    const weaponMockID = weaponMockInstance._id as string;
    const weaponMockUpdateInstance = {
      en: { ...weaponMockInstance.en, name: 'None' },
      pt: { ...weaponMockInstance.pt, name: 'None' }
    };

    const { name: _1, ...weaponsMockEnWithoutName } = weaponMockPayload.en;
    const { name: _2, ...weaponsMockPtWithoutName } = weaponMockPayload.pt;
    const weaponMockPayloadWrong = {
      en: weaponsMockEnWithoutName,
      pt: weaponsMockPtWithoutName
    };

    beforeAll(() => {
      jest.spyOn(WeaponsModelMock, 'update').mockResolvedValueOnce(weaponMockUpdateInstance)
        .mockResolvedValue(null);
    });

    it('should return correct data with updated values', async () => {
      const responseTest = await WeaponsServicesMock.update(weaponMockID, weaponMockPayload as Internacional<Weapon>);
      expect(responseTest).toBe(weaponMockUpdateInstance);
    });

    it('should throw an error when payload is incorrect', async () => {
      try {
        await WeaponsServicesMock.update(weaponMockID, weaponMockPayloadWrong as Internacional<Weapon>);
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
        await WeaponsServicesMock.update('inexistent_id', weaponMockPayload as Internacional<Weapon>);
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a weapon with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });

  describe('When service for delete a weapon is called', () => {
    const weaponMockID = weaponMockInstance._id as string;

    beforeAll(() => {
      jest.spyOn(WeaponsModelMock, 'findOne').mockResolvedValueOnce(weaponMockInstance)
        .mockResolvedValue(null);

      jest.spyOn(WeaponsModelMock, 'delete').mockResolvedValue(null);
    });

    it('should delete weapon and not return any data', async () => {
      try {
        await WeaponsServicesMock.delete(weaponMockID);
      } catch (error) {
        fail('it should not reach here')
      }
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await WeaponsServicesMock.delete('inexistent_id');
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a weapon with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });
});
