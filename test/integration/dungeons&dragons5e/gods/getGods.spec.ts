import requester from '../../../support/requester';
import DatabaseManagement, { DnDGod, Internacional, mongoose, MongoModel } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Get RPG gods from database', () => {
    let model: MongoModel<Internacional<DnDGod>>;
    const _god = mocks.god.instance;
    const { _id: _, ...godMockPayload } = _god as Internacional<DnDGod>;

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => { logger('info', 'Test database connection instanciated'); })
            .catch(() => { logger('error', 'Test database connection failed'); });

        const DM = new DatabaseManagement();
        model = DM.modelInstance('dungeons&dragons5e', 'Gods');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When request all rpg gods', () => {
        it('should return an array with gods', async () => {
            const keysToTest = ['name', 'alignment', 'suggestedDomains', 'symbol', 'phanteon'];

            const response = await model.create(godMockPayload);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/gods').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg gods', () => {
        it('should return an array with disabled gods', async () => {
            const keysToTest = ['name', 'alignment', 'suggestedDomains', 'symbol', 'phanteon'];

            const godMockCopy = {
                active: false,
                en: { ...godMockPayload.en, active: false },
                pt: { ...godMockPayload.pt, active: false },
            };

            const response = await model.create(godMockCopy);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/gods/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg god', () => {
        it('should return a god instance', async () => {
            const keysToTest = ['name', 'alignment', 'suggestedDomains', 'symbol', 'phanteon'];

            await model.create(godMockPayload);

            const { body } = await requester.get(`/dnd5e/gods/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await requester
                .get(`/dnd5e/gods/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
