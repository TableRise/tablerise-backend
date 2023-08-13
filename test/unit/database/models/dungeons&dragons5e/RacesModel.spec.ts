import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Race } from 'src/schemas/dungeons&dragons5e/racesValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Model } from 'mongoose';
import RacesModel from 'src/database/models/dungeons&dragons5e/RacesModel';

describe('Database :: Models :: BackgroundsModel', () => {
    describe('When a method of RacesModel class is called with correct params', () => {
        const newRacesModel = new RacesModel();
        const testReturn = mocks.race.instance as Internacional<Race>;
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
            const responseTest = await newRacesModel.create(testReturn);
            expect(responseTest).toBe(testReturnWithID);
        });

        it('should have the expected return when findAll', async () => {
            const responseTest = await newRacesModel.findAll();
            expect(responseTest).toStrictEqual([testReturnWithID]);
        });

        it('should have the expected return when findOne', async () => {
            const responseTest = await newRacesModel.findOne(testReturnWithID._id);
            expect(responseTest).toBe(testReturnWithID);
        });

        it('should have the expected return when update', async () => {
            const responseTest = await newRacesModel.update(testReturnWithID._id, testReturn);
            expect(responseTest).toStrictEqual({ ...testReturnWithID, _id: secondID });
        });

        it('should have the expected return when delete', async () => {
            const responseTest = await newRacesModel.delete(testReturnWithID._id);
            expect(responseTest).toStrictEqual({});
        });
    });
});
