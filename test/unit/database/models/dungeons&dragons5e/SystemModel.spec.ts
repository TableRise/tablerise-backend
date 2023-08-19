import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Model } from 'mongoose';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import SystemsModel from 'src/database/models/dungeons&dragons5e/SystemModel';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Database :: Models :: SystemsModel', () => {
    describe('When a method of SystemsModel class is called with correct params', () => {
        const newSystemsModel = new SystemsModel();
        const testReturn = mocks.system.instance as System;
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
            const responseTest = await newSystemsModel.create(testReturn);
            expect(responseTest).toBe(testReturnWithID);
        });

        it('should have the expected return when findAll', async () => {
            const responseTest = await newSystemsModel.findAll();
            expect(responseTest).toStrictEqual([testReturnWithID]);
        });

        it('should have the expected return when findOne', async () => {
            const responseTest = await newSystemsModel.findOne(testReturnWithID._id);
            expect(responseTest).toBe(testReturnWithID);
        });

        it('should have the expected return when update', async () => {
            const responseTest = await newSystemsModel.update(testReturnWithID._id, testReturn);
            expect(responseTest).toStrictEqual({
                ...testReturnWithID,
                _id: secondID,
            });
        });

        it('should have the expected return when delete', async () => {
            const responseTest = await newSystemsModel.delete(testReturnWithID._id);
            expect(responseTest).toStrictEqual({});
        });
    });
});
