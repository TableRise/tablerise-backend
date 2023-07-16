import mocks from 'src/support/mocks';
import { Model } from 'mongoose';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Feat } from 'src/schemas/featsValidationSchema';
import FeatsModel from 'src/database/models/FeatsModel';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Database :: Models :: BackgroundsModel', () => {
  describe('When a method of BackgroundsModel class is called with correct params', () => {
    const newFeatsModel = new FeatsModel();
    const testReturn = mocks.feat.instance as Internacional<Feat>;
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
      const responseTest = await newFeatsModel.create(testReturn);
      expect(responseTest).toBe(testReturnWithID);
    });

    it('should have the expected return when findAll', async () => {
      const responseTest = await newFeatsModel.findAll();
      expect(responseTest).toStrictEqual([testReturnWithID]);
    });

    it('should have the expected return when findOne', async () => {
      const responseTest = await newFeatsModel.findOne(testReturnWithID._id);
      expect(responseTest).toBe(testReturnWithID);
    });

    it('should have the expected return when update', async () => {
      const responseTest = await newFeatsModel.update(testReturnWithID._id, testReturn);
      expect(responseTest).toStrictEqual({ ...testReturnWithID, _id: secondID });
    });

    it('should have the expected return when delete', async () => {
      const responseTest = await newFeatsModel.delete(testReturnWithID._id);
      expect(responseTest).toStrictEqual({});
    });
  });
});
