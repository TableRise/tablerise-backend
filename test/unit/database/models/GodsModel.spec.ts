import mocks from 'src/support/mocks';
import { Model } from 'mongoose';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { God } from 'src/schemas/godsValidationSchema';
import GodsModel from 'src/database/models/GodsModel';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Database :: Models :: GodsModel', () => {
    describe('When a method of GodsModel class is called with correct params', () => {
        const newGodsModel = new GodsModel();
        const testReturn = mocks.system.instance as Internacional<God>;
        const testReturnWithID = { _id: generateNewMongoID(), ...testReturn };
        const secondID = generateNewMongoID();

        beforeAll(() => {
            jest.spyOn(Model, 'create').mockResolvedValue(testReturnWithID as unknown as any[]);
            jest.spyOn(Model, 'find').mockResolvedValue([testReturnWithID]);
            jest.spyOn(Model, 'findOne').mockResolvedValue(testReturnWithID);

            jest.spyOn(Model, 'findByIdAndUpdate').mockResolvedValue({
                ...testReturnWithID,
                _id: secondID,
            });

            jest.spyOn(Model, 'findByIdAndDelete').mockResolvedValue({});
        });

        it('should have the expected return when create', async () => {
            const responseTest = await newGodsModel.create(testReturn);
            expect(responseTest).toBe(testReturnWithID);
        });

        it('should have the expected return when findAll', async () => {
            const responseTest = await newGodsModel.findAll();
            expect(responseTest).toStrictEqual([testReturnWithID]);
        });

        it('should have the expected return when findOne', async () => {
            const responseTest = await newGodsModel.findOne(testReturnWithID._id);
            expect(responseTest).toBe(testReturnWithID);
        });

        it('should have the expected return when update', async () => {
            const responseTest = await newGodsModel.update(testReturnWithID._id, testReturn);
            expect(responseTest).toStrictEqual({
                ...testReturnWithID,
                _id: secondID,
            });
        });
    });
});
