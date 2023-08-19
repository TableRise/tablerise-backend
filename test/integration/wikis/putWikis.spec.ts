import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import WikisModel from 'src/database/models/WikisModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG wikis in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new WikisModel();
    const wiki = mocks.wiki.instance as Internacional<Wiki>;
    const { _id: _, ...wikiPayload } = wiki;

    const newWikiPayload = {
        en: { ...wikiPayload.en, title: 'Wiki' },
        pt: { ...wikiPayload.pt, title: 'Wiki' },
    };

    let documentId: string;

    describe('When update one rpg wiki', () => {
        it('should return updated wiki', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            const response = await model.create(wikiPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/wikis/${documentId}`)
                .send(newWikiPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.title).toBe('Wiki');
            expect(body.pt.title).toBe('Wiki');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/wikis/${documentId}`)
                .send({ data: null } as unknown as Internacional<Wiki>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/wikis/${generateNewMongoID()}`)
                .send({ active: true, ...newWikiPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/wikis/${generateNewMongoID()}`)
                .send(newWikiPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
