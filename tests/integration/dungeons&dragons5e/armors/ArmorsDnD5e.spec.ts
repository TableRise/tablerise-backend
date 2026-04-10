import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFakerDD from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';
import { InjectNewDungeonsAndDragonsArmors } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

const ENTITY_ID = 'aaaabbbb-0001-4000-8000-000000000001';
const BASE_PATH = '/system/dnd5e/armors';

describe('When managing D&D 5e Armors', () => {
    let model: any;

    before(async () => {
        model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Armors');
        await model.erase();
        const [armor] = DomainDataFakerDD.generateDungeonsAndDragonsJSON({
            count: 1,
            entity: 'armors',
            entityId: ENTITY_ID,
        });
        await InjectNewDungeonsAndDragonsArmors(armor);
    });

    after(async () => {
        await model.erase();
    });

    context('And all data is correct', () => {
        it('should return all active armors', async () => {
            const { body } = await requester().get(BASE_PATH).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
        });

        it('should return a single armor by id', async () => {
            const { body } = await requester().get(`${BASE_PATH}/${ENTITY_ID}`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(true);
        });

        it('should toggle armor availability to disabled', async () => {
            const { body } = await requester()
                .patch(`${BASE_PATH}/${ENTITY_ID}`)
                .query({ availability: false })
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(false);
        });

        it('should return all disabled armors', async () => {
            const { body } = await requester().get(`${BASE_PATH}/disabled`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
            expect(body.length).to.be.greaterThan(0);
        });
    });
});
