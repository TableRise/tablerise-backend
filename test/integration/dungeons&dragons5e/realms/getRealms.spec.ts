import request from 'supertest';
import app from 'src/app';
import RealmsModel from 'src/database/models/dungeons&dragons5e/RealmsModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Get RPG realms from database', () => {
    const model = new RealmsModel();
    const _realm = mocks.realm.instance;
    const { _id: _, ...realmMockPayload } = _realm as Internacional<Realm>;

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When request all rpg realms', () => {
        it('should return an array with realms', async () => {
            const keysToTest = ['name', 'description', 'thumbnail'];

            const response = await model.create(realmMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/realms').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg realms', () => {
        it('should return an array with disabled realms', async () => {
            const keysToTest = ['name', 'description', 'thumbnail'];

            const realmMockCopy = {
                active: false,
                en: { ...realmMockPayload.en, active: false },
                pt: { ...realmMockPayload.pt, active: false },
            };

            const response = await model.create(realmMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/realms/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg realm', () => {
        it('should return a realm instance', async () => {
            const keysToTest = ['name', 'description', 'thumbnail'];

            await model.create(realmMockPayload);

            const { body } = await request(app).get(`/dnd5e/realms/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/realms/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a realm with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});