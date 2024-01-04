import sinon from 'sinon';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/Logger';

describe('Infra :: Repositories :: User :: UsersDetailsRepository', () => {
    let usersDetailsRepository: UsersDetailsRepository,
        updateTimestampRepository: any,
        database: any,
        serializer: any;

    const logger: Logger = () => {};

    context('#create', () => {
        const create = sinon.spy(() => ({ firstName: 'Jully' }));

        beforeEach(() => {
            updateTimestampRepository = {};

            database = {
                modelInstance: () => ({
                    create,
                }),
            };

            serializer = {
                postUserDetails: (obj: any) => obj,
            };

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });
        });

        it('should create an user and return serialized', async () => {
            const result = await usersDetailsRepository.create({
                firstName: 'Jully',
            } as UserDetailInstance);

            expect(create).to.have.been.called();
            expect(result).to.have.property('firstName');
            expect(result.firstName).to.be.equal('Jully');
        });
    });

    context('#find', () => {
        const findAll = sinon.spy(() => [{ firstName: 'Jully' }]);

        beforeEach(() => {
            updateTimestampRepository = {};

            database = {
                modelInstance: () => ({
                    findAll,
                }),
            };

            serializer = {
                postUserDetails: (obj: any) => obj,
            };

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });
        });

        it('should find users and return serialized', async () => {
            const result = await usersDetailsRepository.find({});

            expect(findAll).to.have.been.called();
            expect(result).to.be.an('array').that.has.length(1);
            expect(result[0]).to.have.property('firstName');
            expect(result[0].firstName).to.be.equal('Jully');
        });

        it('should find users and return serialized - query undefined', async () => {
            const result = await usersDetailsRepository.find();

            expect(findAll).to.have.been.called();
            expect(result).to.be.an('array').that.has.length(1);
            expect(result[0]).to.have.property('firstName');
            expect(result[0].firstName).to.be.equal('Jully');
        });
    });

    context('#findOne', () => {
        context('when is found', () => {
            const findOne = sinon.spy(() => ({ firstName: 'Jully' }));

            beforeEach(() => {
                updateTimestampRepository = {};

                database = {
                    modelInstance: () => ({
                        findOne,
                    }),
                };

                serializer = {
                    postUserDetails: (obj: any) => obj,
                };

                usersDetailsRepository = new UsersDetailsRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });
            });

            it('should find an user and return serialized', async () => {
                const result = await usersDetailsRepository.findOne({
                    firstName: 'Jully',
                });

                expect(findOne).to.have.been.called();
                expect(result).to.have.property('firstName');
                expect(result.firstName).to.be.equal('Jully');
            });

            it('should find an user and return serialized - query undefined', async () => {
                const result = await usersDetailsRepository.findOne();

                expect(findOne).to.have.been.called();
                expect(result).to.have.property('firstName');
                expect(result.firstName).to.be.equal('Jully');
            });
        });

        context('when is not found', () => {
            beforeEach(() => {
                updateTimestampRepository = {};

                database = {
                    modelInstance: () => ({ findOne: () => null }),
                };

                serializer = {
                    postUserDetails: (obj: any) => obj,
                };

                usersDetailsRepository = new UsersDetailsRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });
            });

            it('should find an user and return serialized', async () => {
                try {
                    await usersDetailsRepository.findOne({ firstName: 'Jully' });
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
            const update = sinon.spy(() => ({ firstName: 'Jully May' }));

            beforeEach(() => {
                updateTimestampRepository = {
                    updateTimestamp: () => {},
                };

                database = {
                    modelInstance: sinon.spy(() => ({
                        update,
                    })),
                };

                serializer = {
                    postUserDetails: (obj: any) => obj,
                };

                usersDetailsRepository = new UsersDetailsRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });
            });

            it('should update an user and return serialized', async () => {
                const result = await usersDetailsRepository.update({
                    query: { firstName: 'Jully' },
                    payload: { firstName: 'Jully May' },
                });

                expect(update).to.have.been.called();
                expect(result).to.have.property('firstName');
                expect(result.firstName).to.be.equal('Jully May');
            });
        });

        context('when is not found', () => {
            beforeEach(() => {
                updateTimestampRepository = {
                    updateTimestamp: () => {},
                };

                database = {
                    modelInstance: () => ({ update: () => null }),
                };

                serializer = {
                    postUserDetails: (obj: any) => obj,
                };

                usersDetailsRepository = new UsersDetailsRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });
            });

            it('should update an user and return serialized', async () => {
                try {
                    await usersDetailsRepository.update({
                        query: { firstName: 'Jully' },
                        payload: { firstName: 'Jully May' },
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
                modelInstance: () => ({
                    delete: deleteSpy,
                }),
            };

            serializer = {};

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });
        });

        it('should delete an user', async () => {
            await usersDetailsRepository.delete({ firstName: 'Jully' });
            expect(deleteSpy).to.have.been.called();
        });
    });
});
