import requester from '../../../support/requester';
import DatabaseManagement, { MongoModel, mongoose } from '@tablerise/database-management';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import mocks from 'src/infra/mocks/dungeons&dragons5e';
import generateNewMongoID from 'src/support/helpers/generateNewMongoID';

import { Feat } from 'src/schemas/dungeons&dragons5e/featsValidationSchema';
import { Internacional } from 'src/infra/helpers/common/languagesWrapperZod';
import logger from '@tablerise/dynamic-logger';

describe('Patch RPG feats in database', () => {
    let model: MongoModel<Internacional<Feat>>;
    const feat = mocks.feat.instance as Internacional<Feat>;
    const { _id: _, ...featPayload } = feat;

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
        model = database.modelInstance('dungeons&dragons5e', 'Feats');
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When update availability one rpg feat', () => {
        it('should return a string with feat updated id', async () => {
            const response = await model.create(featPayload);
            documentId = response._id as string;

            const { body } = await requester()
                .patch(`/dnd5e/feats/${documentId}?availability=false`)
                .expect(HttpStatusCode.OK);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe(`Feat ${documentId} was deactivated`);
            expect(body.name).toBe('success');
        });

        it('should fail when availability already enabled', async () => {
            const response = await model.create(featPayload);
            documentId = response._id as string;

            const { body } = await requester()
                .patch(`/dnd5e/feats/${documentId}?availability=true`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when availability already disabled', async () => {
            await requester().patch(`/dnd5e/feats/${documentId}?availability=false`);

            const { body } = await requester()
                .patch(`/dnd5e/feats/${documentId}?availability=false`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('Not possible to change availability through this route');
            expect(body.name).toBe('BadRequest');
        });

        it('should fail when query is wrong', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/feats/${documentId}?availability=wrongQuery`)
                .expect(HttpStatusCode.BAD_REQUEST);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('The query is invalid');
            expect(body.name).toBe('Invalid Entry');
        });

        it('should fail with inexistent ID', async () => {
            const { body } = await requester()
                .patch(`/dnd5e/feats/${generateNewMongoID()}?availability=false`)
                .expect(HttpStatusCode.NOT_FOUND);

            expect(body).toHaveProperty('message');
            expect(body).toHaveProperty('name');
            expect(body.message).toBe('NotFound an object with provided ID');
            expect(body.name).toBe('NotFound');
        });
    });
});
