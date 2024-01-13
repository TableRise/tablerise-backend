import sinon from 'sinon';
import GetDisabledArmorsOperation from 'src/core/dungeons&dragons5e/operations/armors/GetDisabledArmorsOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Users :: Operations :: GetDisabledArmorsOperation', () => {
    let getDisabledArmorsOperation: GetDisabledArmorsOperation,
        getDisabledArmorsService: any,
        armors: any;

    const logger = (): void => {};

    context('When armors are recovered with success', () => {
        before(() => {
            armors = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 3,
                entity: 'armors',
            });

            getDisabledArmorsService = {
                getAllDisabled: sinon.spy(() => armors),
            };

            getDisabledArmorsOperation = new GetDisabledArmorsOperation({
                getDisabledArmorsService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const armorsTest = await getDisabledArmorsOperation.execute();

            expect(getDisabledArmorsService.getAllDisabled).to.have.been.called();
            expect(armorsTest).to.be.deep.equal(armors);
        });
    });
});
