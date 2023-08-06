import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import FeatsModel from 'src/database/models/FeatsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Feat } from 'src/schemas/featsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Patch RPG feats in database', () => {
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

    describe('When update availability one rpg feat', () => {
        it('should return a string with feat updated id', async () => {
            const response = await model.create(featPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .patch(`/feats/${documentId}?availability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Feat ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = await model.create(featPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .patch(`/feats/${documentId}?availability=true`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Entity already enabled');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await request(app).patch(`/feats/${documentId}?availability=false`);

            const { body } = await request(app)
                .patch(`/feats/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Entity already disabled');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await request(app)
                .patch(`/feats/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .patch(`/feats/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a feat with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
