import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel, mongoose } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { Feat } from 'src/schemas/dungeons&dragons5e/featsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import logger from '@tablerise/dynamic-logger';

describe('Get RPG feats from database', () => {
    let model: MongoModel<Internacional<Feat>>;
    const feat = mocks.feat.instance;
    const { _id: _, ...featMockPayload } = feat as Internacional<Feat>;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });

        const database = new DatabaseManagement();
        model = database.modelInstance('dungeons&dragons5e', 'Feats');
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    describe('When request all rpg feats', () => {
        it('should return an array with feats', async () => {
            const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];

            const response = await model.create(featMockPayload);
            documentId = response._id as string;

            const { body } = await requester().get('/dnd5e/feats').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg feats', () => {
        it('should return an array with disabled feats', async () => {
            const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];
            const featMockCopy = {
                active: false,
                en: { ...featMockPayload.en, active: false },
                pt: { ...featMockPayload.pt, active: false },
            };

            const response = await model.create(featMockCopy);
            documentId = response._id as string;

            const { body } = await requester().get('/dnd5e/feats/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg feat', () => {
        it('should return a feat instance', async () => {
            const keysToTest = ['name', 'prerequisite', 'description', 'benefits'];

            await model.create(featMockPayload);

            const { body } = await requester().get(`/dnd5e/feats/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await requester()
                .get(`/dnd5e/feats/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
