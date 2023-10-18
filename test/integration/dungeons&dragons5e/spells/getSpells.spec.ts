import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel, mongoose } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/services/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { Spell } from 'src/schemas/dungeons&dragons5e/spellsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import logger from '@tablerise/dynamic-logger';

describe('Get RPG spells from database', () => {
    let model: MongoModel<Internacional<Spell>>;
    const _spell = mocks.spell.instance;
    const { _id: _, ...spellMockPayload } = _spell as Internacional<Spell>;

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
        model = database.modelInstance('dungeons&dragons5e', 'Spells');
    });

    afterAll(async() => {
        await mongoose.connection.close();
    });

    describe('When request all rpg spells', () => {
        it('should return an array with spells', async () => {
            const keysToTest = [
                'name',
                'description',
                'type',
                'level',
                'higherLevels',
                'damage',
                'castingTime',
                'duration',
                'range',
                'components',
                'buffs',
                'debuffs',
            ];

            const response = await model.create(spellMockPayload);
            documentId = response._id as string;

            const { body } = await requester().get('/dnd5e/spells').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request all disabled rpg spells', () => {
        it('should return an array with disabled spells', async () => {
            const keysToTest = [
                'name',
                'description',
                'type',
                'level',
                'higherLevels',
                'damage',
                'castingTime',
                'duration',
                'range',
                'components',
                'buffs',
                'debuffs',
            ];
            const spellMockCopy = {
                active: false,
                en: { ...spellMockPayload.en, active: false },
                pt: { ...spellMockPayload.pt, active: false },
            };

            const response = await model.create(spellMockCopy);
            documentId = response._id as string;

            const { body } = await requester().get('/dnd5e/spells/disabled').expect(HttpStatusCode.OK);

            expect(body).toBeInstanceOf(Array);
            expect(body[0]).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body[0].en).toHaveProperty(key);
                expect(body[0].pt).toHaveProperty(key);
            });
        });
    });

    describe('When request one rpg spell', () => {
        it('should return a spell instance', async () => {
            const keysToTest = [
                'name',
                'description',
                'type',
                'level',
                'higherLevels',
                'damage',
                'castingTime',
                'duration',
                'range',
                'components',
                'buffs',
                'debuffs',
            ];

            await model.create(spellMockPayload);

            const { body } = await requester().get(`/dnd5e/spells/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await requester()
                .get(`/dnd5e/spells/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
