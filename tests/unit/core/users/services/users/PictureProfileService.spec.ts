import sinon from 'sinon';
import PictureProfileService from 'src/core/users/services/users/PictureProfileService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Users :: Services :: Users :: PictureProfileService', () => {
    let pictureProfileService: PictureProfileService,
        imageStorageClient: any,
        usersRepository: any,
        user: UserInstance,
        userWithPicture: UserInstance;

    const logger = (): void => {};

    context('#uploadPicture', () => {
        context('When update picture with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.picture = {
                    id: '',
                    link: '',
                    uploadDate: new Date(),
                };

                userWithPicture = {
                    ...user,
                    picture: {
                        id: '123',
                        link: 'https://123.com',
                        uploadDate: new Date(),
                    },
                };

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => userWithPicture),
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://123.com',
                        },
                    }),
                };

                pictureProfileService = new PictureProfileService({
                    imageStorageClient,
                    usersRepository,
                    logger,
                });
            });

            it('should call correct methods and return correct data', async () => {
                const payload = {
                    userId: user.userId,
                    image: '' as unknown as FileObject,
                };

                const userUpdated = await pictureProfileService.uploadPicture(payload);

                expect(usersRepository.update).to.have.been.calledWith();
                expect(userUpdated).to.have.property('picture');
                expect(userUpdated.picture).to.have.property('id');
                expect(userUpdated.picture).to.have.property('link');
                expect(userUpdated.picture).to.have.property('uploadDate');

                if (!userUpdated.picture) return;
                expect(userUpdated.picture.id).to.be.equal('123');
                expect(userUpdated.picture.link).to.be.equal('https://123.com');
                expect(userUpdated.picture.uploadDate).to.be.instanceOf(Date);
            });
        });

        context('When update picture with success - days higher than 15', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.picture = {
                    id: '123',
                    link: '',
                    uploadDate: new Date('2023-12-01T17:30:26.393Z'),
                };

                userWithPicture = {
                    ...user,
                    picture: {
                        id: '123',
                        link: 'https://123.com',
                        uploadDate: new Date(),
                    },
                };

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => userWithPicture),
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://123.com',
                        },
                    }),
                };

                pictureProfileService = new PictureProfileService({
                    imageStorageClient,
                    usersRepository,
                    logger,
                });
            });

            it('should call correct methods and return correct data', async () => {
                const payload = {
                    userId: user.userId,
                    image: '' as unknown as FileObject,
                };

                const userUpdated = await pictureProfileService.uploadPicture(payload);

                expect(usersRepository.update).to.have.been.calledWith();
                expect(userUpdated).to.have.property('picture');
                expect(userUpdated.picture).to.have.property('id');
                expect(userUpdated.picture).to.have.property('link');
                expect(userUpdated.picture).to.have.property('uploadDate');

                if (!userUpdated.picture) return;
                expect(userUpdated.picture.id).to.be.equal('123');
                expect(userUpdated.picture.link).to.be.equal('https://123.com');
                expect(userUpdated.picture.uploadDate).to.be.instanceOf(Date);
            });
        });

        context('When update picture with success - no picture property', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                user.picture = null;
                userWithPicture = {
                    ...user,
                    picture: {
                        id: '123',
                        link: 'https://123.com',
                        uploadDate: new Date(),
                    },
                };

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => userWithPicture),
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://123.com',
                        },
                    }),
                };

                pictureProfileService = new PictureProfileService({
                    imageStorageClient,
                    usersRepository,
                    logger,
                });
            });

            it('should call correct methods and return correct data', async () => {
                const payload = {
                    userId: user.userId,
                    image: '' as unknown as FileObject,
                };

                const userUpdated = await pictureProfileService.uploadPicture(payload);

                expect(usersRepository.update).to.have.been.calledWith();
                expect(userUpdated).to.have.property('picture');
                expect(userUpdated.picture).to.have.property('id');
                expect(userUpdated.picture).to.have.property('link');
                expect(userUpdated.picture).to.have.property('uploadDate');

                if (!userUpdated.picture) return;
                expect(userUpdated.picture.id).to.be.equal('123');
                expect(userUpdated.picture.link).to.be.equal('https://123.com');
                expect(userUpdated.picture.uploadDate).to.be.instanceOf(Date);
            });
        });

        context('When update picture fails', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];

                user.picture = {
                    id: '123',
                    link: 'https://123.com',
                    uploadDate: new Date(),
                };

                userWithPicture = {
                    ...user,
                    picture: {
                        id: '123',
                        link: 'https://123.com',
                        uploadDate: new Date(),
                    },
                };

                usersRepository = {
                    findOne: () => user,
                    update: sinon.spy(() => userWithPicture),
                };

                imageStorageClient = {
                    upload: () => ({
                        data: {
                            id: '123',
                            link: 'https://123.com',
                        },
                    }),
                };

                pictureProfileService = new PictureProfileService({
                    imageStorageClient,
                    usersRepository,
                    logger,
                });
            });

            it('should throw correct error', async () => {
                const payload = {
                    userId: user.userId,
                    image: '' as unknown as FileObject,
                };

                try {
                    await pictureProfileService.uploadPicture(payload);
                    expect('it should not be here').to.be.equal(false);
                } catch (error) {
                    const err = error as HttpRequestErrors;
                    expect(err.message).to.be.equal(
                        'You only can upload a new profile picture one time in 15-days'
                    );
                    expect(err.code).to.be.equal(HttpStatusCode.FORBIDDEN);
                    expect(err.name).to.be.equal('ForbiddenRequest');
                }
            });
        });
    });
});
