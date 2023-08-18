import request from 'supertest';
import app from 'src/app';
import DatabaseManagement, { DnDSpell, Internacional } from '@tablerise/database-management';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Get RPG spells from database', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('dungeons&dragons5e', 'Spells');
    const _spell = mocks.spell.instance;
    const { _id: _, ...spellMockPayload } = _spell as Internacional<DnDSpell>;

    let documentId: string;

    afterAll(async () => {
        await model.connection.close();
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

            const { body } = await request(app).get('/dnd5e/spells').expect(HttpStatusCode.OK);

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

            const { body } = await request(app).get('/dnd5e/spells/disabled').expect(HttpStatusCode.OK);

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

            const { body } = await request(app).get(`/dnd5e/spells/${documentId}`).expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(JSON.stringify(body._id)).toStrictEqual(JSON.stringify(documentId));
        });

        it('should fail when ID NotFound', async () => {
            const { body } = await request(app)
                .get(`/dnd5e/spells/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a spell with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
