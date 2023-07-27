import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import MonstersModel from 'src/database/models/MonstersModel';
import mocks from 'src/support/mocks';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Monster } from 'src/schemas/monstersValidationSchema';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG monsters in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new MonstersModel();
    const monster = mocks.monster.instance as Internacional<Monster>;
    const { _id: _, ...monsterPayload } = monster;

    const newMonsterPayload = {
        en: { ...monsterPayload.en, name: 'Dragon' },
        pt: { ...monsterPayload.pt, name: 'Dragão' },
    };

    let documentId: string;

    describe('When update one rpg monster', () => {
        it('should return updated monster', async () => {
            const keysToTest = ['title', 'description', 'reference', 'image', 'subTopics'];

            const response = await model.create(monsterPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/monsters/${documentId}`)
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
                .put(`/monsters/${documentId}`)
                .send({ data: null } as unknown as Internacional<Monster>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/monsters/${generateNewMongoID()}`)
                .send(newMonsterPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a spell with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
