import request from 'supertest';
import app from 'src/app';
import WikisModel from 'src/database/models/dungeons&dragons5e/WikisModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Wiki } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Get RPG wikis from database', () => {
    const model = new WikisModel();
    const wiki = mocks.wiki.instance;
    const { _id: _, ...wikiMockPayload } = wiki as Internacional<Wiki>;

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When request all rpg wikis', () => {
        it('should return an array with wikis', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            const response = await model.create(wikiMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/wikis').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg wikis', () => {
        it('should return an array with disabled wikis', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            const weaponMockCopy = {
                active: false,
                en: { ...wikiMockPayload.en, active: false },
                pt: { ...wikiMockPayload.pt, active: false },
            };

            const response = await model.create(weaponMockCopy);
            documentId = response._id as string;

            const { body } = await request(app).get('/dnd5e/wikis/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg wiki', () => {
        it('should return a wiki instance', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            await model.create(wikiMockPayload);

            const { body } = await request(app).get(`/dnd5e/wikis/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/wikis/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a wiki with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
