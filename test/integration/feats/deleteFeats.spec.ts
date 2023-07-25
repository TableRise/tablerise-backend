import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import FeatsModel from 'src/database/models/FeatsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Feat } from 'src/schemas/featsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG feats in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new FeatsModel();
    const feat = mocks.feat.instance as Internacional<Feat>;
    const { _id: _, ...featPayload } = feat;

    let documentId: string;

    describe('When delete one rpg feat', () => {
        it('should return 204 status with no content', async () => {
            const response = await model.create(featPayload);
            documentId = response._id as string;

            const { body } = await request(app).delete(`/feats/${documentId}`).expect(HttpStatusCode.DELETED);

            expect(body).toStrictEqual({});
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .delete(`/feats/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a feat with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
