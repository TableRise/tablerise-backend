import request from 'supertest';
import app from 'src/app';
import FeatsModel from 'src/database/models/dungeons&dragons5e/FeatsModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Feat } from 'src/schemas/dungeons&dragons5e/featsValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Get RPG feats from database', () => {
    const model = new FeatsModel();
    const feat = mocks.feat.instance;
    const { _id: _, ...featMockPayload } = feat as Internacional<Feat>;

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When request all rpg feats', () => {
        it('should return an array with feats', async () => {
            const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];

            const response = await model.create(featMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/feats').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg feats', () => {
        it('should return an array with disabled feats', async () => {
            const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];
            const featMockCopy = {
                active: false,
                en: { ...featMockPayload.en, active: false },
                pt: { ...featMockPayload.pt, active: false },
            };

            const response = await model.create(featMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/feats/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg feat', () => {
        it('should return a feat instance', async () => {
            const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];

            await model.create(featMockPayload);

            const { body } = await request(app).get(`/dnd5e/feats/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/feats/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a feat with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
