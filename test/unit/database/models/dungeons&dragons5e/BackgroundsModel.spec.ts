import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Model } from 'mongoose';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Background } from 'src/schemas/dungeons&dragons5e/backgroundsValidationSchema';
import BackgroundsModel from 'src/database/models/dungeons&dragons5e/BackgroundsModel';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Database :: Models :: BackgroundsModel', () => {
    describe('When a method of BackgroundsModel class is called with correct params', () => {
        const newBackgroundsModel = new BackgroundsModel();
        const testReturn = mocks.system.instance as Internacional<Background>;
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

        afterAll(async () => {
            jest.clearAllMocks();
            await Connections['dungeons&dragons5e'].close();
        });

        it('should have the expected return when create', async () => {
            const responseTest = await newBackgroundsModel.create(testReturn);
            expect(responseTest).toBe(testReturnWithID);
        });

        it('should have the expected return when findAll', async () => {
            const responseTest = await newBackgroundsModel.findAll();
            expect(responseTest).toStrictEqual([testReturnWithID]);
        });

        it('should have the expected return when findOne', async () => {
            const responseTest = await newBackgroundsModel.findOne(testReturnWithID._id);
            expect(responseTest).toBe(testReturnWithID);
        });

        it('should have the expected return when update', async () => {
            const responseTest = await newBackgroundsModel.update(testReturnWithID._id, testReturn);
            expect(responseTest).toStrictEqual({
                ...testReturnWithID,
                _id: secondID,
            });
        });

        it('should have the expected return when delete', async () => {
            const responseTest = await newBackgroundsModel.delete(testReturnWithID._id);
            expect(responseTest).toStrictEqual({});
        });
    });
});
