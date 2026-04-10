import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFakerDD from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';
import { InjectNewDungeonsAndDragonsFeats } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

const ENTITY_ID = 'aaaabbbb-0004-4000-8000-000000000004';
const BASE_PATH = '/system/dnd5e/feats';

describe('When managing D&D 5e Feats', () => {
    let model: any;

    before(async () => {
        model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Feats');
        await model.erase();
        const [feat] = DomainDataFakerDD.generateDungeonsAndDragonsJSON({
            count: 1,
            entity: 'feats',
            entityId: ENTITY_ID,
        });
        await InjectNewDungeonsAndDragonsFeats(feat);
    });

    after(async () => {
        await model.erase();
    });

    context('And all data is correct', () => {
        it('should return all active feats', async () => {
            const { body } = await requester().get(BASE_PATH).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
        });

        it('should return a single feat by id', async () => {
            const { body } = await requester().get(`${BASE_PATH}/${ENTITY_ID}`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(true);
        });

        it('should toggle feat availability to disabled', async () => {
            const { body } = await requester()
                .patch(`${BASE_PATH}/${ENTITY_ID}`)
                .query({ availability: false })
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(false);
        });

        it('should return all disabled feats', async () => {
            const { body } = await requester().get(`${BASE_PATH}/disabled`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
            expect(body.length).to.be.greaterThan(0);
        });
    });
});
