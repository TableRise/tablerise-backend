import request from 'supertest';
import app from 'src/app';
import DatabaseManagement, { DnDSpell, Internacional } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG spells in database', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('dungeons&dragons5e', 'Spells');
    const spell = mocks.spell.instance as Internacional<DnDSpell>;
    const { _id: _, ...spellPayload } = spell;

    const newSpellPayload = {
        en: { ...spellPayload.en, name: 'Fire' },
        pt: { ...spellPayload.pt, name: 'Fogo' },
    };

    let documentId: string;

    afterAll(async () => {
        await model.connection.close();
    });

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
                .put(`/dnd5e/spells/${documentId}`)
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
                .put(`/dnd5e/spells/${documentId}`)
                .send({ data: null } as unknown as Internacional<DnDSpell>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/spells/${generateNewMongoID()}`)
                .send({ active: true, ...newSpellPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/spells/${generateNewMongoID()}`)
                .send(newSpellPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a spell with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
