import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../../connectDatabaseTest';
import ClassesModel from 'src/database/models/dungeons&dragons5e/ClassesModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Put RPG classes in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new ClassesModel();
    const _class = mocks.class.instance as Internacional<Class>;
    const { _id: _, ...classPayload } = _class;

    const newClassPayload = {
        en: { ...classPayload.en, name: 'Bard' },
        pt: { ...classPayload.pt, name: 'Bardo' },
    };

    let documentId: string;

    describe('When update one rpg class', () => {
        it('should return updated class', async () => {
            const keysToTest = [
                'name',
                'description',
                'hitPoints',
                'proficiencies',
                'equipment',
                'levelingSpecs',
                'characteristics',
            ];

            const response = await model.create(classPayload);
            documentId = response._id as string;

            const { body } = await request(app)
                .put(`/dnd5e/classes/${documentId}`)
                .send(newClassPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Bard');
            expect(body.pt.name).toBe('Bardo');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/classes/${documentId}`)
                .send({ data: null } as unknown as Internacional<Class>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/classes/${generateNewMongoID()}`)
                .send({ active: true, ...newClassPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .put(`/dnd5e/classes/${generateNewMongoID()}`)
                .send(newClassPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a class with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
