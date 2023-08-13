import request from 'supertest';
import app from 'src/app';
import MonstersModel from 'src/database/models/dungeons&dragons5e/MonstersModel';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';
import Connections from 'src/database/DatabaseConnection';

describe('Put RPG monsters in database', () => {
    const model = new MonstersModel();
    const monster = mocks.monster.instance as Internacional<Monster>;
    const { _id: _, ...monsterPayload } = monster;

    const newMonsterPayload = {
        en: { ...monsterPayload.en, name: 'Dragon' },
        pt: { ...monsterPayload.pt, name: 'Dragão' },
    };

    let documentId: string;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When update one rpg monster', () => {
        it('should return updated monster', async () => {
            const keysToTest = ['name', 'characteristics', 'stats', 'abilityScore', 'skills', 'actions', 'picture'];

            const response = await model.create(monsterPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/dnd5e/monsters/${documentId}`)
                .send(newMonsterPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Dragon');
            expect(body.pt.name).toBe('Dragão');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/monsters/${documentId}`)
                .send({ data: null } as unknown as Internacional<Monster>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/monsters/${generateNewMongoID()}`)
                .send({ active: true, ...newMonsterPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/monsters/${generateNewMongoID()}`)
                .send(newMonsterPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a monster with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
