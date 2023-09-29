import requester from '../../../support/requester';
import DatabaseManagement, { mongoose, MongoModel } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';
import { MagicItem } from 'src/schemas/dungeons&dragons5e/magicItemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';

describe('Get RPG magic items from database', () => {
    let model: MongoModel<Internacional<MagicItem>>;
    const magicItem = mocks.magicItems.instance;
    const { _id: _, ...magicItemMockPayload } = magicItem as Internacional<MagicItem>;

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
        model = DM.modelInstance('dungeons&dragons5e', 'MagicItems');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When request all rpg magic items', () => {
        it('should return an array with magic items', async () => {
            const keysToTest = ['name', 'characteristics', 'description'];

            const response = await model.create(magicItemMockPayload);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/magicItems').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg magic items', () => {
        it('should return an array with disabled magic items', async () => {
            const keysToTest = ['name', 'characteristics', 'description'];
            const magicItemMockCopy = {
                active: false,
                en: { ...magicItemMockPayload.en, active: false },
                pt: { ...magicItemMockPayload.pt, active: false },
            };

            const response = await model.create(magicItemMockCopy);
            documentId = response._id as string;

            const { body } = await requester.get('/dnd5e/magicItems/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg magic item', () => {
        it('should return a magic item instance', async () => {
            const keysToTest = ['name', 'characteristics', 'description'];

            await model.create(magicItemMockPayload);

            const { body } = await requester.get(`/dnd5e/magicItems/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await requester
                .get(`/dnd5e/magicItems/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
