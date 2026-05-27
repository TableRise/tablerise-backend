import sinon from 'sinon';
import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import { Logger } from 'src/types/shared/logger';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';

describe('Infra :: Repositories :: User :: UsersDetailsRepository', () => {
    let usersDetailsRepository: UsersDetailsRepository, updateTimestampRepository: any, database: any, serializer: any;

    const logger: Logger = () => {};

    context('#internal helpers', () => {
        it('should return undefined when the raw collection model is missing', () => {
            updateTimestampRepository = {};

            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'UserDetails' ? undefined : { findOne: sinon.stub().returns(null) },
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

            expect((usersDetailsRepository as any).getRawCollection()).to.equal(undefined);
        });

        it('should not hide user details when no detail payload is provided', async () => {
            updateTimestampRepository = {};

            database = {
                modelInstance: () => ({
                    findOne: sinon.stub().returns(null),
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

            const result = await (usersDetailsRepository as any).shouldHideUserDetail(undefined);

            expect(result).to.equal(false);
        });
    });

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
            } as UserDetail);

            expect(create).to.have.been.called();
            expect(result).to.have.property('firstName');
            expect(result.firstName).to.be.equal('Jully');
        });

        it('should persist raw gameInfo counters when a raw collection exists', async () => {
            const updateOne = sinon.stub().resolves();
            const rawFindOne = sinon.stub().resolves({
                userId: 'user-1',
                userDetailId: 'detail-1',
                firstName: 'Jully',
                gameInfo: {
                    campaignsCreatedAmount: 3,
                },
            });

            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'UserDetails'
                        ? {
                              create,
                              _model: {
                                  collection: {
                                      updateOne,
                                      findOne: rawFindOne,
                                  },
                              },
                          }
                        : {
                              findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                          },
            };

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });

            const result = await usersDetailsRepository.create({
                firstName: 'Jully',
                gameInfo: {
                    campaignsCreatedAmount: 3,
                },
            } as UserDetail);

            expect(updateOne).to.have.been.calledOnce();
            expect(result.gameInfo.campaignsCreatedAmount).to.equal(3);
        });

        it('should skip raw persistence when the payload has no numeric campaignsCreatedAmount', async () => {
            const updateOne = sinon.stub().resolves();

            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'UserDetails'
                        ? {
                              create,
                              _model: {
                                  collection: {
                                      updateOne,
                                      findOne: sinon.stub().resolves({ firstName: 'Jully' }),
                                  },
                              },
                          }
                        : {
                              findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                          },
            };

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });

            await usersDetailsRepository.create({
                firstName: 'Jully',
                gameInfo: {} as any,
            } as UserDetail);

            expect(updateOne).to.not.have.been.called();
        });

        it('should create without raw persistence when the raw collection has no updateOne', async () => {
            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'UserDetails'
                        ? {
                              create,
                              _model: {
                                  collection: {
                                      findOne: sinon.stub().resolves({ firstName: 'Jully' }),
                                  },
                              },
                          }
                        : {
                              findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                          },
            };

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });

            const result = await usersDetailsRepository.create({
                firstName: 'Jully',
            } as UserDetail);

            expect(result.firstName).to.equal('Jully');
        });
    });

    context('#find', () => {
        let findAll: sinon.SinonStub;

        beforeEach(() => {
            findAll = sinon.stub().returns([{ userId: 'user-1', firstName: 'Jully' }]);
            updateTimestampRepository = {};

            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'UserDetails'
                        ? {
                              findAll,
                          }
                        : {
                              findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                          },
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

        it('should filter users waiting to be deleted', async () => {
            findAll.returns([
                { userId: 'user-1', firstName: 'Jully' },
                { userId: 'user-2', firstName: 'Hidden' },
            ]);

            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'UserDetails'
                        ? {
                              findAll,
                          }
                        : {
                              findOne: sinon
                                  .stub()
                                  .callsFake(({ userId }) =>
                                      userId === 'user-2'
                                          ? { inProgress: { status: InProgressStatusEnum.enum.WAIT_TO_DELETE_USER } }
                                          : { inProgress: { status: 'done' } }
                                  ),
                          },
            };

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });

            const result = await usersDetailsRepository.find({});

            expect(result).to.have.lengthOf(1);
            expect(result[0]).to.include({ userId: 'user-1', firstName: 'Jully' });
            expect(result[0].gameInfo).to.deep.equal({
                campaigns: [],
                characters: [],
                badges: [],
                charactersCreatedAmount: 0,
                campaignsJoinedAmount: 0,
                campaignsCreatedAmount: 0,
                campaignsClosedAmount: 0,
                equipBoughtAmount: 0,
            });
        });

        it('should prefer the raw collection when available', async () => {
            const toArray = sinon.stub().resolves([{ userId: 'user-1', firstName: 'Raw User' }]);

            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'UserDetails'
                        ? {
                              _model: {
                                  collection: {
                                      find: sinon.stub().returns({ toArray }),
                                  },
                              },
                              findAll: sinon.stub().throws(new Error('should not use findAll')),
                          }
                        : {
                              findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                          },
            };

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });

            const result = await usersDetailsRepository.find({});

            expect(toArray).to.have.been.calledOnce();
            expect(result[0].firstName).to.equal('Raw User');
        });

        it('should keep user details visible when the linked user lookup returns nothing', async () => {
            findAll.returns([{ userId: 'user-1', firstName: 'Jully' }]);

            database = {
                modelInstance: (_scope: string, modelName: string) =>
                    modelName === 'UserDetails'
                        ? {
                              findAll,
                          }
                        : {
                              findOne: sinon.stub().returns(null),
                          },
            };

            usersDetailsRepository = new UsersDetailsRepository({
                updateTimestampRepository,
                database,
                serializer,
                logger,
            });

            const result = await usersDetailsRepository.find({});

            expect(result).to.have.length(1);
            expect(result[0].firstName).to.equal('Jully');
        });
    });

    context('#findOne', () => {
        context('when is found', () => {
            let findOne: sinon.SinonStub;

            beforeEach(() => {
                findOne = sinon.stub().returns({ userId: 'user-1', firstName: 'Jully' });
                updateTimestampRepository = {};

                database = {
                    modelInstance: (_scope: string, modelName: string) =>
                        modelName === 'UserDetails'
                            ? {
                                  findOne,
                              }
                            : {
                                  findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                              },
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

            it('should return null when user is waiting to be deleted', async () => {
                findOne.returns({ userId: 'user-2', firstName: 'Hidden' });

                database = {
                    modelInstance: (_scope: string, modelName: string) =>
                        modelName === 'UserDetails'
                            ? {
                                  findOne,
                              }
                            : {
                                  findOne: sinon.stub().returns({
                                      inProgress: { status: InProgressStatusEnum.enum.WAIT_TO_DELETE_USER },
                                  }),
                              },
                };

                usersDetailsRepository = new UsersDetailsRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });

                const result = await usersDetailsRepository.findOne({
                    firstName: 'Hidden',
                });

                expect(result).to.equal(null);
            });

            it('should not try to hide a detail when userId is missing', async () => {
                findOne.returns({ firstName: 'Anonymous detail' });

                const result = await usersDetailsRepository.findOne({
                    firstName: 'Anonymous detail',
                });

                expect(result.firstName).to.equal('Anonymous detail');
            });

            it('should fallback to model.findOne when no raw collection exists', async () => {
                const result = await usersDetailsRepository.findOne({
                    firstName: 'Jully',
                });

                expect(findOne).to.have.been.calledOnce();
                expect(result.firstName).to.equal('Jully');
            });

            it('should prefer raw findOne over model.findOne when available', async () => {
                const rawFindOne = sinon.stub().resolves({ userId: 'user-1', firstName: 'Raw Jully' });
                findOne = sinon.stub().throws(new Error('should not use model.findOne'));

                database = {
                    modelInstance: (_scope: string, modelName: string) =>
                        modelName === 'UserDetails'
                            ? {
                                  findOne,
                                  _model: {
                                      collection: {
                                          findOne: rawFindOne,
                                      },
                                  },
                              }
                            : {
                                  findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                              },
                };

                usersDetailsRepository = new UsersDetailsRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });

                const result = await usersDetailsRepository.findOne({
                    firstName: 'Raw Jully',
                });

                expect(rawFindOne).to.have.been.calledOnce();
                expect(result.firstName).to.equal('Raw Jully');
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

            it('should persist raw counters and reread the raw document when available', async () => {
                const updateOne = sinon.stub().resolves();
                const rawFindOne = sinon.stub().resolves({
                    userId: 'user-1',
                    firstName: 'Jully May',
                    gameInfo: {
                        campaignsCreatedAmount: 9,
                    },
                });

                updateTimestampRepository = {
                    updateTimestamp: sinon.stub().resolves(),
                };

                database = {
                    modelInstance: (_scope: string, modelName: string) =>
                        modelName === 'UserDetails'
                            ? {
                                  update,
                                  _model: {
                                      collection: {
                                          updateOne,
                                          findOne: rawFindOne,
                                      },
                                  },
                              }
                            : {
                                  findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                              },
                };

                usersDetailsRepository = new UsersDetailsRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });

                const result = await usersDetailsRepository.update({
                    query: { firstName: 'Jully' },
                    payload: {
                        firstName: 'Jully May',
                        gameInfo: {
                            campaignsCreatedAmount: 9,
                        },
                    },
                });

                expect(updateOne).to.have.been.calledOnce();
                expect(rawFindOne).to.have.been.calledOnce();
                expect(result.gameInfo.campaignsCreatedAmount).to.equal(9);
            });

            it('should skip raw counter persistence during update when campaignsCreatedAmount is absent', async () => {
                const updateOne = sinon.stub().resolves();

                updateTimestampRepository = {
                    updateTimestamp: sinon.stub().resolves(),
                };

                database = {
                    modelInstance: (_scope: string, modelName: string) =>
                        modelName === 'UserDetails'
                            ? {
                                  update,
                                  _model: {
                                      collection: {
                                          updateOne,
                                          findOne: sinon.stub().resolves({ userId: 'user-1', firstName: 'Jully May' }),
                                      },
                                  },
                              }
                            : {
                                  findOne: sinon.stub().returns({ inProgress: { status: 'done' } }),
                              },
                };

                usersDetailsRepository = new UsersDetailsRepository({
                    updateTimestampRepository,
                    database,
                    serializer,
                    logger,
                });

                await usersDetailsRepository.update({
                    query: { firstName: 'Jully' },
                    payload: {
                        firstName: 'Jully May',
                    },
                });

                expect(updateOne).to.not.have.been.called();
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
