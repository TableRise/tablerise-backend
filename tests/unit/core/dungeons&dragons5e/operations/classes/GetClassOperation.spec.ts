import sinon from 'sinon';
import GetClassOperation from 'src/core/dungeons&dragons5e/operations/classes/GetClassOperation';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Operations :: GetClassOperation', () => {
    let getClassOperation: GetClassOperation, getClassService: any, classInDb: any;

    const logger = (): void => {};

    context('When classes are recovered with success', () => {
        before(() => {
            classInDb = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'classes',
            });

            getClassService = {
                get: sinon.spy(() => classInDb),
            };

            getClassOperation = new GetClassOperation({
                getClassService,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const classTest = await getClassOperation.execute('123');

            expect(getClassService.get).to.have.been.calledWith('123');
            expect(classTest).to.be.deep.equal(classInDb);
        });
    });
});
