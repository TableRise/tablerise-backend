import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFakerDD from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';
import { InjectNewDungeonsAndDragonsWikis } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

const ENTITY_ID = 'aaaabbbb-0013-4000-8000-000000000013';
const BASE_PATH = '/system/dnd5e/wikis';

describe('When managing D&D 5e Wikis', () => {
    let model: any;

    before(async () => {
        model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Wikis');
        await model.erase();
        const [wiki] = DomainDataFakerDD.generateDungeonsAndDragonsJSON({
            count: 1,
            entity: 'wikis',
            entityId: ENTITY_ID,
        });
        await InjectNewDungeonsAndDragonsWikis(wiki);
    });

    after(async () => {
        await model.erase();
    });

    context('And all data is correct', () => {
        it('should return all active wikis', async () => {
            const { body } = await requester().get(BASE_PATH).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
        });

        it('should return a single wiki by id', async () => {
            const { body } = await requester().get(`${BASE_PATH}/${ENTITY_ID}`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(true);
        });

        it('should toggle wiki availability to disabled', async () => {
            const { body } = await requester()
                .patch(`${BASE_PATH}/${ENTITY_ID}`)
                .query({ availability: false })
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(false);
        });

        it('should return all disabled wikis', async () => {
            const { body } = await requester().get(`${BASE_PATH}/disabled`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
            expect(body.length).to.be.greaterThan(0);
        });
    });
});
