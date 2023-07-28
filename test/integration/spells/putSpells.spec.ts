import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import SpellsModel from 'src/database/models/SpellsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Spell } from 'src/schemas/spellsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG spells in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new SpellsModel();
    const spell = mocks.spell.instance as Internacional<Spell>;
    const { _id: _, ...spellPayload } = spell;

    const newSpellPayload = {
        en: { ...spellPayload.en, name: 'Fire' },
        pt: { ...spellPayload.pt, name: 'Fogo' },
    };

    let documentId: string;

    describe('When update one rpg spell', () => {
        it('should return updated spell', async () => {
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

            const response = await model.create(spellPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/spells/${documentId}`)
                .send(newSpellPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Fire');
            expect(body.pt.name).toBe('Fogo');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/spells/${documentId}`)
                .send({ data: null } as unknown as Internacional<Spell>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/spells/${generateNewMongoID()}`)
                .send(newSpellPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a spell with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
