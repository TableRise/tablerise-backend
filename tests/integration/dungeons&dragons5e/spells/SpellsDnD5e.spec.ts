import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFakerDD from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';
import { InjectNewDungeonsAndDragonsSpells } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

const ENTITY_ID = 'aaaabbbb-0011-4000-8000-000000000011';
const BASE_PATH = '/system/dnd5e/spells';

describe('When managing D&D 5e Spells', () => {
    let model: any;

    before(async () => {
        model = new DatabaseManagement().modelInstance('dungeons&dragons5e', 'Spells');
        await model.erase();
        const [spell] = DomainDataFakerDD.generateDungeonsAndDragonsJSON({
            count: 1,
            entity: 'spells',
            entityId: ENTITY_ID,
        });
        await InjectNewDungeonsAndDragonsSpells(spell);
    });

    after(async () => {
        await model.erase();
    });

    context('And all data is correct', () => {
        it('should return all active spells', async () => {
            const { body } = await requester().get(BASE_PATH).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
        });

        it('should return a single spell by id', async () => {
            const { body } = await requester().get(`${BASE_PATH}/${ENTITY_ID}`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(true);
        });

        it('should toggle spell availability to disabled', async () => {
            const { body } = await requester()
                .patch(`${BASE_PATH}/${ENTITY_ID}`)
                .query({ availability: false })
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body.active).to.be.equal(false);
        });

        it('should return all disabled spells', async () => {
            const { body } = await requester().get(`${BASE_PATH}/disabled`).expect(HttpStatusCode.OK);

            expect(body).to.be.an('array');
            expect(body.length).to.be.greaterThan(0);
        });
    });
});
