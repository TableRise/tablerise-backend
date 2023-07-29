import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import ClassesModel from 'src/database/models/ClassesModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Class } from 'src/schemas/classesValidationSchema';
import mocks from 'src/support/mocks';
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

    const newPayload = { active: false };

    let documentId: string;

    describe('When update availability one rpg class', () => {
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
                .patch(`/classes/${documentId}`)
                .send(newPayload)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('_id');
            expect(body).toHaveProperty('active');
            expect(body.active).toBe(false);

            keysToTest.forEach((key) => {
                expect(body.en).toHaveProperty(key);
                expect(body.pt).toHaveProperty(key);
            });

            expect(body.en.name).toBe('Bard');
            expect(body.pt.name).toBe('Bardo');
        });

        it('should fail when availability already updated', async () => {
            const { body } = await request(app)
                .patch(`/classes/${documentId}`)
                .send({ active: false })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Entity already disabled');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when data is wrong', async () => {
            const { body } = await request(app)
                .patch(`/classes/${documentId}`)
                .send({ data: null } as unknown as Internacional<Class>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('active');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .patch(`/classes/${generateNewMongoID()}`)
                .send(newPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a class with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
