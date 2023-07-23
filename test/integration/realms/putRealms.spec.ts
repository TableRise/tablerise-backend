import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import RealmsModel from 'src/database/models/RealmsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Realm } from 'src/schemas/realmsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG realms in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new RealmsModel();
    const realm = mocks.realm.instance as Internacional<Realm>;
    const { _id: _, ...realmPayload } = realm;

    const newRealmPayload = {
        en: { ...realmPayload.en, name: 'Olympo' },
        pt: { ...realmPayload.pt, name: 'Olympo' },
    };

    let documentId: string;

    describe('When update one rpg realm', () => {
        it('should return updated realm', async () => {
            const keysToTest = ['name', 'description', 'thumbnail'];

            const response = await model.create(realmPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/realms/${documentId}`)
                .send(newRealmPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Olympo');
            expect(body.pt.name).toBe('Olympo');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/realms/${documentId}`)
                .send({ data: null } as unknown as Internacional<Realm>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/realms/${generateNewMongoID()}`)
                .send(newRealmPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a realm with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
