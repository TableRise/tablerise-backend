import mocks from 'src/support/mocks';
import { Model } from 'mongoose';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import MagicItemsModel from 'src/database/models/MagicItemsModel';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Database :: Models :: MagicItemsModel', () => {
  describe('When a method of MagicItemsModel class is called with correct params', () => {
    const newMagicItemsModel = new MagicItemsModel();
    const testReturn = mocks.magicItems.instance as Internacional<MagicItem>;
    const testReturnWithID = { _id: generateNewMongoID(), ...testReturn };
    const secondID = generateNewMongoID();

    beforeAll(() => {
      jest.spyOn(Model, 'create').mockResolvedValue(testReturnWithID as unknown as any[]);
      jest.spyOn(Model, 'find').mockResolvedValue([testReturnWithID]);
      jest.spyOn(Model, 'findOne').mockResolvedValue(testReturnWithID);

      jest.spyOn(Model, 'findByIdAndUpdate').mockResolvedValue({ ...testReturnWithID, _id: secondID });

      jest.spyOn(Model, 'findByIdAndDelete').mockResolvedValue({});
    });

    it('should have the expected return when create', async () => {
      const responseTest = await newMagicItemsModel.create(testReturn);
      expect(responseTest).toBe(testReturnWithID);
    });

    it('should have the expected return when findAll', async () => {
      const responseTest = await newMagicItemsModel.findAll();
      expect(responseTest).toStrictEqual([testReturnWithID]);
    });

    it('should have the expected return when findOne', async () => {
      const responseTest = await newMagicItemsModel.findOne(testReturnWithID._id);
      expect(responseTest).toBe(testReturnWithID);
    });

    it('should have the expected return when update', async () => {
      const responseTest = await newMagicItemsModel.update(testReturnWithID._id, testReturn);
      expect(responseTest).toStrictEqual({ ...testReturnWithID, _id: secondID });
    });

    it('should have the expected return when delete', async () => {
      const responseTest = await newMagicItemsModel.delete(testReturnWithID._id);
      expect(responseTest).toStrictEqual({});
    });
  });
});
