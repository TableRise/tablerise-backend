import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DungeonsAndDragonsRepository from 'src/infra/repositories/dungeons&dragons5e/DungeonsAndDragonsRepository';
import { Logger } from 'src/types/shared/logger';

describe('Infra :: Repositories :: DungeonsAndDragon :: DungeonsAndDragonsRepository', () => {
    let dungeonsAndDragonsRepository: DungeonsAndDragonsRepository, database: any;

    const logger: Logger = () => {};

    context('#find', () => {
        const findAll = sinon.spy(() => [{ name: 'Couro' }]);

        beforeEach(() => {
            database = {
                modelInstance: () => ({
                    findAll,
                }),
            };

            dungeonsAndDragonsRepository = new DungeonsAndDragonsRepository({
                database,
                logger,
            });

            dungeonsAndDragonsRepository.setEntity('Items');
        });

        it('should find dungeonsAndDragons entity and return serialized', async () => {
            const result: any = await dungeonsAndDragonsRepository.find({});

            expect(findAll).to.have.been.called();
            expect(result).to.be.an('array').that.has.length(1);
            expect(result[0]).to.have.property('name');
            expect(result[0].name).to.be.equal('Couro');
        });

        it('should find dungeonsAndDragons entity and return serialized - query undefined', async () => {
            const result: any = await dungeonsAndDragonsRepository.find();

            expect(findAll).to.have.been.called();
            expect(result).to.be.an('array').that.has.length(1);
            expect(result[0]).to.have.property('name');
            expect(result[0].name).to.be.equal('Couro');
        });
    });

    context('#findOne', () => {
        context('when is found', () => {
            const findOne = sinon.spy(() => ({ name: 'Couro' }));

            beforeEach(() => {
                database = {
                    modelInstance: sinon.spy(() => ({
                        findOne,
                    })),
                };

                dungeonsAndDragonsRepository = new DungeonsAndDragonsRepository({
                    database,
                    logger,
                });
            });

            it('should find an dungeonsAndDragons entity and return serialized', async () => {
                const result: any = await dungeonsAndDragonsRepository.findOne({
                    name: 'Couro',
                });

                expect(findOne).to.have.been.called();
                expect(result).to.have.property('name');
                expect(result.name).to.be.equal('Couro');
            });

            it('should find an dungeonsAndDragons entity and return serialized - query undefined', async () => {
                const result: any = await dungeonsAndDragonsRepository.findOne();

                expect(findOne).to.have.been.called();
                expect(result).to.have.property('name');
                expect(result.name).to.be.equal('Couro');
            });
        });

        context('when is not found', () => {
            beforeEach(() => {
                database = {
                    modelInstance: () => ({
                        findOne: () => null,
                    }),
                };

                dungeonsAndDragonsRepository = new DungeonsAndDragonsRepository({
                    database,
                    logger,
                });
            });

            it('should find an dungeonsAndDragons and return serialized', async () => {
                try {
                    await dungeonsAndDragonsRepository.findOne({
                        name: 'Couro',
                    });
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'This content do not exist in the RPG system'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });

    context('#update', () => {
        context('when is found', () => {
            const update = sinon.spy(() => ({ name: 'Couro' }));

            beforeEach(() => {
                database = {
                    modelInstance: () => ({
                        update,
                    }),
                };

                dungeonsAndDragonsRepository = new DungeonsAndDragonsRepository({
                    database,
                    logger,
                });
            });

            it('should update an dungeonsAndDragons entity and return serialized', async () => {
                const result: any = await dungeonsAndDragonsRepository.update({
                    query: { name: 'Pote' },
                    payload: { name: 'Couro' },
                });

                expect(update).to.have.been.called();
                expect(result).to.have.property('name');
                expect(result.name).to.be.equal('Couro');
            });
        });

        context('when is not found', () => {
            beforeEach(() => {
                database = {
                    modelInstance: sinon.spy(() => ({
                        update: () => null,
                    })),
                };

                dungeonsAndDragonsRepository = new DungeonsAndDragonsRepository({
                    database,
                    logger,
                });
            });

            it('should update an dungeonsAndDragons entity and return serialized', async () => {
                try {
                    await dungeonsAndDragonsRepository.update({
                        query: { name: 'Pote' },
                        payload: { name: 'Couro' },
                    });
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'This content do not exist in the RPG system'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });
});
