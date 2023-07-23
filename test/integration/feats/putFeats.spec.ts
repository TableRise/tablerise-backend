import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import FeatsModel from 'src/database/models/FeatsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Feat } from 'src/schemas/featsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG feats in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new FeatsModel();
    const feat = mocks.feat.instance as Internacional<Feat>;
    const { _id: _, ...featPayload } = feat;

    const newFeatPayload = {
        en: { ...featPayload.en, name: 'Warrior' },
        pt: { ...featPayload.pt, name: 'Warrior' },
    };

    let documentId: string;

    describe('When update one rpg feat', () => {
        it('should return updated feat', async () => {
            const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];

            const response = await model.create(featPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/feats/${documentId}`)
                .send(newFeatPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Warrior');
            expect(body.pt.name).toBe('Warrior');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/feats/${documentId}`)
                .send({ data: null } as unknown as Internacional<Feat>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/feats/${generateNewMongoID()}`)
                .send(newFeatPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a feat with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
