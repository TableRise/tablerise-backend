import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import RealmsModel from 'src/database/models/RealmsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Realm } from 'src/schemas/realmsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG realms in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new RealmsModel();
    const realm = mocks.realm.instance as Internacional<Realm>;
    const { _id: _, ...realmPayload } = realm;

    let documentId: string;

    describe('When delete one rpg realm', () => {
        it('should return 204 status with no content', async () => {
            const response = await model.create(realmPayload);
            documentId = response._id as string;

            const { body } = await request(app).delete(`/realms/${documentId}`).expect(HttpStatusCode.DELETED);

            expect(body).toStrictEqual({});
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .delete(`/realms/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a realm with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
