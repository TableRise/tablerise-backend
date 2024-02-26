import sinon from 'sinon';
import GetClassService from 'src/core/dungeons&dragons5e/services/classes/GetClassService';
import DomainDataFaker from 'src/infra/datafakers/dungeons&dragons5e/DomainDataFaker';

describe('Core :: Dungeons&Dragons5e :: Services :: GetClassService', () => {
    let getClassService: GetClassService,
        dungeonsAndDragonsRepository: any,
        classInDb: any;

    const logger = (): void => {};

    context('When class is recovered with success', () => {
        before(() => {
            classInDb = DomainDataFaker.generateDungeonsAndDragonsJSON({
                count: 1,
                entity: 'classes',
            });

            dungeonsAndDragonsRepository = {
                findOne: sinon.spy(() => classInDb),
                setEntity: sinon.spy(() => {}),
            };

            getClassService = new GetClassService({
                dungeonsAndDragonsRepository,
                logger,
            });
        });

        it('should return the correct data and call correct methods', async () => {
            const classTest = await getClassService.get('123');

            expect(dungeonsAndDragonsRepository.setEntity).to.have.been.calledWith(
                'Classes'
            );
            expect(classTest).to.be.deep.equal(classInDb);
        });
    });
});
