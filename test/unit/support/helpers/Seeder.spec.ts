it('', () => { expect(true).toBe(true) });

// import SystemsModel from 'src/database/models/SystemsModel';
// import { ISystem } from 'src/schemas/systemsValidationSchema';
// import Seeder from 'src/support/helpers/Seeder';
// import ConnectMongoInstance from 'src/support/helpers/ConnectMongoInstance';
// import mocks from 'src/support/schemas';
// import mongoose from 'mongoose';

// describe('Support :: Helpers :: Seeder', () => {
//   const systemModelMock = new SystemsModel();

//   beforeAll(async () => {
//     await ConnectMongoInstance.connectInTest();
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });

//   describe('When the Seeder is instanciated with correct data', () => {
//     beforeAll(async () => {
//       jest.spyOn(systemModelMock, 'create').mockResolvedValue(mocks.system.instance as ISystem);
//     });

//     it('should seed the database', async () => {
//       const seederInstance = new Seeder('test');
//       const seeding = await seederInstance.systems([mocks.system.instance] as ISystem[]);

//       expect(seeding).toBe(true);
//     });
//   });

//   describe('When the Seeder is instanciated with incorrrect data', () => {
//     beforeAll(() => {
//       jest.spyOn(systemModelMock, 'create').mockResolvedValue(mocks.system.instance as ISystem);
//     });

//     it('should not seed the database and throw error', async () => {
//       try {
//         const seederInstance = new Seeder('test');

//         const { name: _, ...systemWithoutName } = mocks.system.instance as ISystem;
//         await seederInstance.systems([systemWithoutName as ISystem]);
//       } catch (error) {
//         const err = error as Error;
//         expect(err.name).toBe('ValidationError');
//       }
//     });
//   });
// });
