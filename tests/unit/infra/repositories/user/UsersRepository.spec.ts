import sinon from 'sinon';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import UsersRepository from 'src/infra/repositories/user/UsersRepository';
import { Logger } from 'src/types/Logger';

describe('Infra :: Repositories :: User :: UsersRepository', () => {
    let usersRepository: UsersRepository,
        updateTimestampRepository: any,
        database: any,
        serializer: any;

    const logger: Logger = () => {};

    context('#create', () => {
        const create = sinon.spy(() => ({ email: 'test@email.com' }));

        beforeEach(() => {
            updateTimestampRepository = {};

            database = {
                modelInstance: () => ({
                    create,
                }),
            };

            serializer = {
                postUser: (obj: any) => obj,
            };

            usersRepository = new UsersRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });
        });

        it('should create an user and return serialized', async () => {
            const result = await usersRepository.create({
                email: 'test@email.com',
            } as UserInstance);

            expect(create).to.have.been.called();
            expect(result).to.have.property('email');
            expect(result.email).to.be.equal('test@email.com');
        });
    });

    context('#find', () => {
        const findAll = sinon.spy(() => [{ email: 'test@email.com' }]);

        beforeEach(() => {
            updateTimestampRepository = {};

            database = {
                modelInstance: () => ({
                    findAll,
                }),
            };

            serializer = {
                postUser: (obj: any) => obj,
            };

            usersRepository = new UsersRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });
        });

        it('should find users and return serialized', async () => {
            const result = await usersRepository.find({});

            expect(findAll).to.have.been.called();
            expect(result).to.be.an('array').that.has.length(1);
            expect(result[0]).to.have.property('email');
            expect(result[0].email).to.be.equal('test@email.com');
        });

        it('should find users and return serialized - query undefined', async () => {
            const result = await usersRepository.find();

            expect(findAll).to.have.been.called();
            expect(result).to.be.an('array').that.has.length(1);
            expect(result[0]).to.have.property('email');
            expect(result[0].email).to.be.equal('test@email.com');
        });
    });

    context('#findOne', () => {
        context('when is found', () => {
            const findOne = sinon.spy(() => ({ email: 'test@email.com' }));

            beforeEach(() => {
                updateTimestampRepository = {};

                database = {
                    modelInstance: sinon.spy(() => ({
                        findOne,
                    })),
                };

                serializer = {
                    postUser: (obj: any) => obj,
                };

                usersRepository = new UsersRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });
            });

            it('should find an user and return serialized', async () => {
                const result = await usersRepository.findOne({ email: 'test@email.com' });

                expect(findOne).to.have.been.called();
                expect(result).to.have.property('email');
                expect(result.email).to.be.equal('test@email.com');
            });

            it('should find an user and return serialized - query undefined', async () => {
                const result = await usersRepository.findOne();

                expect(findOne).to.have.been.called();
                expect(result).to.have.property('email');
                expect(result.email).to.be.equal('test@email.com');
            });
        });

        context('when is not found', () => {
            beforeEach(() => {
                updateTimestampRepository = {};

                database = {
                    modelInstance: () => ({
                        findOne: () => null,
                    }),
                };

                serializer = {
                    postUser: (obj: any) => obj,
                };

                usersRepository = new UsersRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });
            });

            it('should find an user and return serialized', async () => {
                try {
                    await usersRepository.findOne({ email: 'test@email.com' });
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });

    context('#update', () => {
        context('when is found', () => {
            const update = sinon.spy(() => ({ email: 'test2@email.com' }));

            beforeEach(() => {
                updateTimestampRepository = {
                    updateTimestamp: () => {},
                };

                database = {
                    modelInstance: () => ({
                        update,
                    }),
                };

                serializer = {
                    postUser: (obj: any) => obj,
                };

                usersRepository = new UsersRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });
            });

            it('should update an user and return serialized', async () => {
                const result = await usersRepository.update({
                    query: { email: 'test@email.com' },
                    payload: { email: 'test2@email.com' },
                });

                expect(update).to.have.been.called();
                expect(result).to.have.property('email');
                expect(result.email).to.be.equal('test2@email.com');
            });
        });

        context('when is not found', () => {
            beforeEach(() => {
                updateTimestampRepository = {
                    updateTimestamp: () => {},
                };

                database = {
                    modelInstance: sinon.spy(() => ({
                        update: () => null,
                    })),
                };

                serializer = {
                    postUser: (obj: any) => obj,
                };

                usersRepository = new UsersRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });
            });

            it('should update an user and return serialized', async () => {
                try {
                    await usersRepository.update({
                        query: { email: 'test@email.com' },
                        payload: { email: 'test2@email.com' },
                    });
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal('User does not exist');
                    expect(err.code).to.be.equal(HttpStatusCode.NOT_FOUND);
                    expect(err.name).to.be.equal('NotFound');
                }
            });
        });
    });

    context('#delete', () => {
        const deleteSpy = sinon.spy(() => {});

        beforeEach(() => {
            updateTimestampRepository = {};

            database = {
                modelInstance: sinon.spy(() => ({
                    delete: deleteSpy,
                })),
            };

            serializer = {};

            usersRepository = new UsersRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });
        });

        it('should delete an user', async () => {
            await usersRepository.delete({ email: 'test@email.com' });
            expect(deleteSpy).to.have.been.called();
        });
    });
});
