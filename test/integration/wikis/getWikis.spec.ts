import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import WikisModel from 'src/database/models/WikisModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG wikis from database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new WikisModel();
    const wiki = mocks.wiki.instance;
    const { _id: _, ...wikiMockPayload } = wiki as Internacional<Wiki>;

    let documentId: string;

    describe('When request all rpg wikis', () => {
        it('should return an array with wikis', async () => {
            const keysToTest = [
                'title',
                'description',
                'reference',
                'image',
                'subTopics',
            ];

            const response = await model.create(wikiMockPayload);
            documentId = response._id as string;

            const { body } = await request(app).get('/wikis').expect(HttpStatusCode.OK);

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
            const keysToTest = [
                'title',
                'description',
                'reference',
                'image',
                'subTopics',
            ];

            await model.create(wikiMockPayload);

            const { body } = await request(app).get(`/wikis/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app).get(`/wikis/${generateNewMongoID()}`).expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a spell with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
