import sinon from 'sinon';
import GetAllArmorsOperation from 'src/core/dungeons&dragons5e/operations/armors/GetAllArmorsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetAllArmorsOperation', () => {
    let getAllArmorsOperation: GetAllArmorsOperation,
        getAllArmorsService: any,
        armors: any;

    const logger = (): void => {};

    context('When armors are recovered with success', () => {
        before(() => {
            armors = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'armors',
            });

            getAllArmorsService = {
                getAll: sinon.spy(() => armors),
            };

            getAllArmorsOperation = new GetAllArmorsOperation({
                getAllArmorsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const armorsTest = await getAllArmorsOperation.execute();

            expect(getAllArmorsService.getAll).to.have.been.called();
            expect(armorsTest).to.be.deep.equal(armors);
        });
    });
});
