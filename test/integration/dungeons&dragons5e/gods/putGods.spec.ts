import requester from '../../../support/requester';
import DatabaseManagement, { DnDGod, Internacional, mongoose, MongoModel } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import logger from '@tablerise/dynamic-logger';

describe('Put RPG gods in database', () => {
    let model: MongoModel<Internacional<DnDGod>>;
    const god = mocks.god.instance as Internacional<DnDGod>;
    const { _id: _, ...godPayload } = god;

    const newGodPayload = {
        en: { ...godPayload.en, name: 'Fire' },
        pt: { ...godPayload.pt, name: 'Fogo' },
    };

    let documentId: string;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => { logger('info', 'Test database connection instanciated'); })
            .catch(() => { logger('error', 'Test database connection failed'); });

        const DM = new DatabaseManagement();
        model = DM.modelInstance('dungeons&dragons5e', 'Gods');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When update one rpg god', () => {
        it('should return updated god', async () => {
            const keysToTest = ['name', 'alignment', 'suggestedDomains', 'symbol', 'phanteon'];

            const response = await model.create(godPayload);
            documentId = response._id as string;

            const { body } = await requester
                .put(`/dnd5e/gods/${documentId}`)
                .send(newGodPayload)
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
            const { body } = await requester
                .put(`/dnd5e/gods/${documentId}`)
                .send({ data: null } as unknown as Internacional<DnDGod>)
                .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(JSON.parse(body.message)[0].path[0]).toBe('en');
            expect(JSON.parse(body.message)[0].message).toBe('Required');
            expect(body.name).toBe('ValidationError');
        });

        it('should fail when try to change availability', async () => {
            const { body } = await requester
                .put(`/dnd5e/gods/${generateNewMongoID()}`)
                .send({ active: true, ...newGodPayload })
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester
                .put(`/dnd5e/gods/${generateNewMongoID()}`)
                .send(newGodPayload)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
