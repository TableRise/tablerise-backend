import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../../connectDatabaseTest';
import GodsModel from 'src/database/models/dungeons&dragons5e/GodsModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { God } from 'src/schemas/dungeons&dragons5e/godsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG gods from database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new GodsModel();
    const _god = mocks.god.instance;
    const { _id: _, ...godMockPayload } = _god as Internacional<God>;

    let documentId: string;

    describe('When request all rpg gods', () => {
        it('should return an array with gods', async () => {
            const keysToTest = ['name', 'alignment', 'suggestedDomains', 'symbol', 'phanteon'];

            const response = await model.create(godMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/gods').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg gods', () => {
        it('should return an array with disabled gods', async () => {
            const keysToTest = ['name', 'alignment', 'suggestedDomains', 'symbol', 'phanteon'];

            const godMockCopy = {
                active: false,
                en: { ...godMockPayload.en, active: false },
                pt: { ...godMockPayload.pt, active: false },
            };

            const response = await model.create(godMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/gods/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg god', () => {
        it('should return a god instance', async () => {
            const keysToTest = ['name', 'alignment', 'suggestedDomains', 'symbol', 'phanteon'];

            await model.create(godMockPayload);

            const { body } = await request(app).get(`/dnd5e/gods/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/gods/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a god with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
