import { Model, model as mongooseCreateModel, Schema } from 'mongoose';
import MongoModel from 'src/database/models/MongoModel';
import generateNewMongoID from 'src/helpers/generateNewMongoID';

describe('Database :: Models :: MongoModel', () => {
  interface ITest {
    value: number
  };

  const testMongooseSchema = new Schema<ITest>({
    value: String
  });

  class TestModel extends MongoModel<ITest> {
    constructor(public model = mongooseCreateModel('Test', testMongooseSchema)) {
      super(model);
    }
  }

  describe('When a method of MongoModel class is called with correct params', () => {
    const newTestModel = new TestModel();
    const testReturn = { value: 10 };
    const testReturnWithID = { _id: generateNewMongoID(), value: 10 };
    const secondID = generateNewMongoID();

    beforeAll(() => {
      jest.spyOn(Model, 'create').mockResolvedValue(testReturnWithID as unknown as any[]);
      jest.spyOn(Model, 'find').mockResolvedValue([testReturnWithID]);
      jest.spyOn(Model, 'findOne').mockResolvedValue(testReturnWithID);

      jest.spyOn(Model, 'findByIdAndUpdate').mockResolvedValue({ ...testReturnWithID, _id: secondID });

      jest.spyOn(Model, 'findByIdAndDelete').mockResolvedValue({});
    });

    it('should have the expected return when create', async () => {
      const responseTest = await newTestModel.create(testReturn);
      expect(responseTest).toBe(testReturnWithID);
    });

    it('should have the expected return when findAll', async () => {
      const responseTest = await newTestModel.findAll();
      expect(responseTest).toStrictEqual([testReturnWithID]);
    });

    it('should have the expected return when findOne', async () => {
      const responseTest = await newTestModel.findOne(testReturnWithID._id);
      expect(responseTest).toBe(testReturnWithID);
    });

    it('should have the expected return when update', async () => {
      const responseTest = await newTestModel.update(testReturnWithID._id, testReturn);
      expect(responseTest).toStrictEqual({ ...testReturnWithID, _id: secondID });
    });

    it('should have the expected return when delete', async () => {
      const responseTest = await newTestModel.delete(testReturnWithID._id);
      expect(responseTest).toStrictEqual({});
    });
  });
});
