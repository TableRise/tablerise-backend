import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import WikisModel from 'src/database/models/WikisModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG wikis in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new WikisModel();
    const wiki = mocks.wiki.instance as Internacional<Wiki>;
    const { _id: _, ...wikiPayload } = wiki;

    let documentId: string;

    describe('When delete one rpg wiki', () => {
        it('should return 204 status with no content', async () => {
            const response = await model.create(wikiPayload);
            documentId = response._id as string;

            const { body } = await request(app).delete(`/wikis/${documentId}`).expect(HttpStatusCode.DELETED);

            expect(body).toStrictEqual({});
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .delete(`/wikis/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a spell with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
