import request from 'supertest';
import app from 'src/app';
import { connect, close } from '../../connectDatabaseTest';
import SpellsModel from 'src/database/models/SpellsModel';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Spell } from 'src/schemas/spellsValidationSchema';
import mocks from 'src/support/mocks';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

describe('Delete RPG spells in database', () => {
    beforeAll(() => {
        connect();
    });

    afterAll(async () => {
        await close();
    });

    const model = new SpellsModel();
    const spell = mocks.spell.instance as Internacional<Spell>;
    const { _id: _, ...spellPayload } = spell;

    let documentId: string;

    describe('When delete one rpg spell', () => {
        it('should return 204 status with no content', async () => {
            const response = await model.create(spellPayload);
            documentId = response._id as string;

            const { body } = await request(app).delete(`/spells/${documentId}`).expect(HttpStatusCode.DELETED);

            expect(body).toStrictEqual({});
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await request(app)
                .delete(`/spells/${generateNewMongoID()}`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound a spell with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
