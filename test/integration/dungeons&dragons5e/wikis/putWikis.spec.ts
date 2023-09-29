import requester from '../../../support/requester';
import DatabaseManagement, { mongoose, MongoModel } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';
import { Wiki } from 'src/schemas/dungeons&dragons5e/wikisValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

describe('Put RPG wikis in database', () => {
    let model: MongoModel<Internacional<Wiki>>;
    const wiki = mocks.wiki.instance as Internacional<Wiki>;
    const { _id: _, ...wikiPayload } = wiki;

    const newWikiPayload = {
        en: { ...wikiPayload.en, title: 'Wiki' },
        pt: { ...wikiPayload.pt, title: 'Wiki' },
    };

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });

        const DM = new DatabaseManagement();
        model = DM.modelInstance('dungeons&dragons5e', 'Wikis');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When update one rpg wiki', () => {
        it('should return updated wiki', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            const response = await model.create(wikiPayload);
            documentId = response._id as string;

            const { body } = await requester
                .put(`/dnd5e/wikis/${documentId}`)
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
            const { body } = await requester
                .put(`/dnd5e/wikis/${documentId}`)
                .send({ data: null } as unknown as Internacional<Wiki>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.details[0].attribute).toBe('en');
            expect(body.details[0].reason).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await requester
                .put(`/dnd5e/wikis/${generateNewMongoID()}`)
                .send({ active: true, ...newWikiPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester
                .put(`/dnd5e/wikis/${generateNewMongoID()}`)
                .send(newWikiPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
