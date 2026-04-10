import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFakerDD from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';
import { InjectNewDungeonsAndDragonsMonsters } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

const ENTITY_ID = 'aaaabbbb-0008-4000-8000-000000000008';
const BASE_PATH = '/system/dnd5e/monsters';

describe('When managing D&D 5e Monsters', () => {
    let model: any;

    before(async () => {
        model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Monsters');
        await model.erase();
        const [monster] = DomainDataFakerDD.generateDungeonsAndDragonsJSON({
            count: 1,
            entity: 'monsters',
            entityId: ENTITY_ID,
        });
        await InjectNewDungeonsAndDragonsMonsters(monster);
    });

    after(async () => {
        await model.erase();
    });

    context('And all data is correct', () => {
        it('should return all active monsters', async () => {
            const { body } = await requester().get(BASE_PATH).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
        });

        it('should return a single monster by id', async () => {
            const { body } = await requester().get(`${BASE_PATH}/${ENTITY_ID}`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(true);
        });

        it('should toggle monster availability to disabled', async () => {
            const { body } = await requester()
                .patch(`${BASE_PATH}/${ENTITY_ID}`)
                .query({ availability: false })
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(false);
        });

        it('should return all disabled monsters', async () => {
            const { body } = await requester().get(`${BASE_PATH}/disabled`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
            expect(body.length).to.be.greaterThan(0);
        });
    });
});
