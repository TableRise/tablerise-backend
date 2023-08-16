import request from 'supertest';
import app from 'src/app';
import SystemsModel from 'src/database/models/dungeons&dragons5e/SystemModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Get RPG system from database', () => {
    const model = new SystemsModel();
    const system = mocks.system.instance as System;
    const { _id: _, ...systemPayload } = system;

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When request all rpg systems', () => {
        it('should return an array with systems', async () => {
            const response = await model.create(systemPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/system').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');
            expect(body[0]).toHaveProperty('name');
            expect(body[0]).toHaveProperty('content');
            expect(body[0]).toHaveProperty('references');
            expect(body[0]).toHaveProperty('active');
        });
    });

    describe('When request one rpg system', () => {
        it('should return a system instance', async () => {
            await model.create(systemPayload);

            const { body } = await request(app).get(`/dnd5e/system/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');
            expect(body).toHaveProperty('name');
            expect(body).toHaveProperty('content');
            expect(body).toHaveProperty('references');
            expect(body).toHaveProperty('active');
            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail with id NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/system/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a system with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});