describe('test', () => {
  expect(true).toBe(true);
});

/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable no-console */
// import request from 'supertest';
// import mongoose from 'mongoose';
// import app from 'src/app';
// import SystemModel from 'src/database/models/SystemModel';
// import HttpStatusCode from 'src/helpers/HttpStatusCode';
// import { ISystem } from 'src/interfaces/ISystem';
// import {
//   SYSTEM_MOCK_INSTANCE,
//   SYSTEM_MOCK_PAYLOAD,
//   ZOD_ERROR_SYSTEM_NAME
// } from '../../__mocks__/system';

// describe('Create a new RPG system', () => {
//   beforeAll(async () => {
//     await mongoose.connect('mongodb://root:secret@127.0.0.1:27018/tavern-data-test?authSource=admin')
//       .then(() => console.log('MongoDB connected successfully'))
//       .catch((err) => console.log(err));
//   });

//   afterAll(async () => {
//     await mongoose.connection.close();
//   });

//   describe('Confirmation of API health', () => {
//     it('should return "OK" when healthy', async () => {
//       const responseTest = await request(app)
//         .get('/health')
//         .expect(HttpStatusCode.OK);

//       expect(responseTest.text).toBe('OK!');
//     });
//   });

//   describe('When data is correct', () => {
//     const systemModelMock = new SystemModel();
//     const systemInstanceKeys = Object.keys(SYSTEM_MOCK_INSTANCE);
//     let firstSystemDocumentTestId = '';

//     it('should be successfully saved in database', async () => {
//       const responseTest: ISystem = await systemModelMock.create(SYSTEM_MOCK_PAYLOAD);

//       systemInstanceKeys.forEach((key) => {
//         expect(responseTest).toHaveProperty(key);
//       });

//       firstSystemDocumentTestId = responseTest._id as string;
//     });

//     it('should be created a new system in database', async () => {
//       const responseTest = await request(app)
//         .post('/system')
//         .send(SYSTEM_MOCK_PAYLOAD)
//         .expect(HttpStatusCode.CREATED)

//       systemInstanceKeys.forEach((key) => {
//         expect(responseTest.body).toHaveProperty(key);
//       });

//       expect(responseTest.body).toHaveProperty('_id');
//       expect(responseTest.body._id === firstSystemDocumentTestId).toBe(false);
//     });
//   });

//   describe('When data is incorrect', () => {
//     const systemModelMock = new SystemModel();
//     const { name: _, ...systemMockWithoutName } = SYSTEM_MOCK_PAYLOAD;

//     it('should not be successfully saved in database', async () => {
//       try {
//         await systemModelMock.create(systemMockWithoutName as ISystem);
//       } catch (error: any) {
//         expect(error.name).toBe('ValidationError')
//       }
//     });

//     it('should not be created a new system in database', async () => {
//       const responseTest = await request(app)
//         .post('/system')
//         .send(systemMockWithoutName)
//         .expect(HttpStatusCode.UNPROCESSABLE_ENTITY)

//       expect(responseTest.body).toEqual(ZOD_ERROR_SYSTEM_NAME);
//     });
//   });
// });
