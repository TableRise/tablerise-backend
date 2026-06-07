import sinon from 'sinon';
import PictureProfileService from 'src/core/users/services/users/PictureProfileService';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Users :: Services :: Users :: PictureProfileService', () => {
    const logger = (): void => {};

    const buildUploaded = () => ({
        id: 'image-123',
        link: 'https://img.bb/profile',
        uploadDate: new Date().toISOString(),
        title: '',
        deleteUrl: '',
        request: { success: true, status: 200 },
    });

    it('should upload the profile picture and append it to the user gallery', async () => {
        const user = DomainDataFaker.generateUsersJSON()[0];
        user.picture = {} as User['picture'];
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const uploaded = buildUploaded();

        const usersRepository = {
            findOne: sinon.stub().resolves(user),
            update: sinon.stub().resolves({ ...user, picture: uploaded }),
        };
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().resolves(userDetails),
        };
        const imageStorageClient = {
            upload: sinon.stub().resolves(uploaded),
        };

        const service = new PictureProfileService({
            usersRepository,
            usersDetailsRepository,
            imageStorageClient,
            logger,
        } as any);

        const result = await service.uploadPicture({
            userId: user.userId,
            image: { originalname: 'profile.png' } as FileObject,
        });

        expect(imageStorageClient.upload).to.have.been.calledWith({ originalname: 'profile.png' });
        expect(usersDetailsRepository.update).to.have.been.calledWith({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
        expect(userDetails.gallery.at(-1)).to.deep.equal(uploaded);
        expect(result.picture).to.deep.equal(uploaded);
    });

    it('should reject profile picture updates before uploading when the user does not exist', async () => {
        const usersRepository = {
            findOne: sinon.stub().returns(null),
            update: sinon.stub(),
        };
        const usersDetailsRepository = {
            findOne: sinon.stub(),
            update: sinon.stub(),
        };
        const imageStorageClient = {
            upload: sinon.stub(),
        };

        const service = new PictureProfileService({
            usersRepository,
            usersDetailsRepository,
            imageStorageClient,
            logger,
        } as any);

        try {
            await service.uploadPicture({
                userId: 'missing-user',
                image: {} as FileObject,
            });
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('User does not exist');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(imageStorageClient.upload).to.not.have.been.called();
            expect(usersDetailsRepository.update).to.not.have.been.called();
        }
    });

    it('should use the provided imageObject without calling image storage', async () => {
        const user = DomainDataFaker.generateUsersJSON()[0];
        user.picture = {} as User['picture'];
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const uploaded = buildUploaded();
        const imageStorageClient = {
            upload: sinon.stub().resolves(uploaded),
        };

        const service = new PictureProfileService({
            usersRepository: {
                findOne: sinon.stub().resolves(user),
                update: sinon.stub().resolves({ ...user, picture: uploaded }),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            },
            imageStorageClient,
            logger,
        } as any);

        await service.uploadPicture({
            userId: user.userId,
            imageObject: uploaded,
        });

        expect(imageStorageClient.upload).to.not.have.been.called();
        expect(userDetails.gallery.at(-1)).to.deep.equal(uploaded);
    });

    it('should reject updates when the picture cooldown has not expired', async () => {
        const user = DomainDataFaker.generateUsersJSON()[0];
        user.picture = {
            id: 'existing',
            link: 'https://img.bb/existing',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };

        const service = new PictureProfileService({
            usersRepository: {
                findOne: sinon.stub().resolves(user),
                update: sinon.stub(),
            },
            usersDetailsRepository: {
                findOne: sinon.stub(),
                update: sinon.stub(),
            },
            imageStorageClient: {
                upload: sinon.stub(),
            },
            logger,
        } as any);

        try {
            await service.uploadPicture({
                userId: user.userId,
                image: {} as FileObject,
            });
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('You only can upload a new profile picture one time in 15-days');
            expect(err.code).to.equal(HttpStatusCode.FORBIDDEN);
        }
    });

    it('should reject profile picture updates without an image file or imageObject', async () => {
        const user = DomainDataFaker.generateUsersJSON()[0];
        user.picture = {} as User['picture'];
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const imageStorageClient = {
            upload: sinon.stub(),
        };
        const service = new PictureProfileService({
            usersRepository: {
                findOne: sinon.stub().resolves(user),
                update: sinon.stub(),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub(),
            },
            imageStorageClient,
            logger,
        } as any);

        try {
            await service.uploadPicture({
                userId: user.userId,
            });
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
            expect(err.message).to.equal('An image file or imageObject is required');
            expect(imageStorageClient.upload).to.not.have.been.called();
        }
    });

    it('should allow updates when an existing profile picture is older than the cooldown window', async () => {
        const user = DomainDataFaker.generateUsersJSON()[0];
        user.picture = {
            id: 'existing',
            link: 'https://img.bb/existing',
            uploadDate: '2026-01-01T00:00:00.000Z',
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const uploaded = buildUploaded();
        const imageStorageClient = {
            upload: sinon.stub(),
        };
        const usersRepository = {
            findOne: sinon.stub().resolves(user),
            update: sinon.stub().resolves({ ...user, picture: uploaded }),
        };
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().resolves(userDetails),
        };
        const service = new PictureProfileService({
            usersRepository,
            usersDetailsRepository,
            imageStorageClient,
            logger,
        } as any);

        const result = await service.uploadPicture({
            userId: user.userId,
            imageObject: uploaded,
        });

        expect(result.picture).to.deep.equal(uploaded);
        expect(imageStorageClient.upload).to.not.have.been.called();
        expect(usersDetailsRepository.update).to.have.been.calledOnce();
    });

    it('should allow updates when the user has no profile picture yet', async () => {
        const user = DomainDataFaker.generateUsersJSON()[0];
        user.picture = undefined as any;
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const uploaded = buildUploaded();
        const service = new PictureProfileService({
            usersRepository: {
                findOne: sinon.stub().resolves(user),
                update: sinon.stub().resolves({ ...user, picture: uploaded }),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            },
            imageStorageClient: {
                upload: sinon.stub(),
            },
            logger,
        } as any);

        const result = await service.uploadPicture({
            userId: user.userId,
            imageObject: uploaded,
        });

        expect(result.picture).to.deep.equal(uploaded);
    });
});
