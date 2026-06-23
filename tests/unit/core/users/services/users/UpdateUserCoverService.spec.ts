import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import UpdateUserCoverService from 'src/core/users/services/users/UpdateUserCoverService';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Users :: Services :: Users :: UpdateUserCoverService', () => {
    const logger = (): void => {};
    const createInternalRepository = () => ({
        imagesForDeletion: [] as string[],
        addImageForDeletion(image?: { deleteUrl?: string; delete_url?: string } | null) {
            const deleteUrl = image?.deleteUrl ?? image?.delete_url;
            if (deleteUrl) this.imagesForDeletion.push(deleteUrl);
        },
    });

    it('should upload and persist the new cover image', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.cover = null as any;
        const uploaded = {
            id: 'stub-image-id',
            link: 'https://img.bb/stub-image',
            uploadDate: new Date().toISOString(),
            deleteUrl: '',
            title: '',
            request: { success: true, status: 200 },
        };
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().resolves(),
        };
        const imageStorageClient = {
            upload: sinon.stub().resolves(uploaded),
        };
        const internalRepository = createInternalRepository();
        const service = new UpdateUserCoverService({
            usersDetailsRepository,
            imageStorageClient,
            internalRepository,
            logger,
        } as any);

        await service.update({
            userId: userDetails.userId,
            image: { originalname: 'cover.png' } as FileObject,
        });

        expect(imageStorageClient.upload).to.have.been.calledWith({ originalname: 'cover.png' });
        expect(usersDetailsRepository.update).to.have.been.calledWith({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
        expect(userDetails.cover).to.deep.equal(uploaded);
        expect(internalRepository.imagesForDeletion).to.deep.equal([]);
        expect(userDetails.xp).to.equal(100);
    });

    it('should throw when the user details do not exist', async () => {
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(null),
            update: sinon.stub(),
        };
        const imageStorageClient = {
            upload: sinon.stub(),
        };
        const internalRepository = createInternalRepository();
        const service = new UpdateUserCoverService({
            usersDetailsRepository,
            imageStorageClient,
            internalRepository,
            logger,
        } as any);

        try {
            await service.update({
                userId: 'missing-user',
                image: { originalname: 'cover.png' } as FileObject,
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
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.cover = null as any;
        const uploaded = {
            id: 'stub-image-id',
            link: 'https://img.bb/stub-image',
            uploadDate: new Date().toISOString(),
            deleteUrl: '',
            title: '',
            request: { success: true, status: 200 },
        };
        const imageStorageClient = {
            upload: sinon.stub().resolves(uploaded),
        };
        const internalRepository = createInternalRepository();
        const service = new UpdateUserCoverService({
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(),
            },
            imageStorageClient,
            internalRepository,
            logger,
        } as any);

        await service.update({
            userId: userDetails.userId,
            imageObject: uploaded,
        });

        expect(imageStorageClient.upload).to.not.have.been.called();
        expect(userDetails.cover).to.deep.equal(uploaded);
        expect(userDetails.gallery).to.deep.equal([]);
        expect(internalRepository.imagesForDeletion).to.deep.equal([]);
        expect(userDetails.xp).to.equal(100);
    });

    it('should queue the previous cover deleteUrl when replacing an existing cover', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.cover = {
            id: 'existing-cover',
            link: 'https://img.bb/existing-cover',
            uploadDate: new Date().toISOString(),
            deleteUrl: 'https://img.bb/delete-existing-cover',
            title: '',
            request: { success: true, status: 200 },
        } as any;
        const uploaded = {
            id: 'stub-image-id',
            link: 'https://img.bb/stub-image',
            uploadDate: new Date().toISOString(),
            deleteUrl: '',
            title: '',
            request: { success: true, status: 200 },
        };

        const internalRepository = createInternalRepository();
        const service = new UpdateUserCoverService({
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(),
            },
            imageStorageClient: {
                upload: sinon.stub().resolves(uploaded),
            },
            internalRepository,
            logger,
        } as any);

        await service.update({
            userId: userDetails.userId,
            image: { originalname: 'cover.png' } as FileObject,
        });

        expect(userDetails.xp).to.equal(0);
        expect(internalRepository.imagesForDeletion).to.deep.equal(['https://img.bb/delete-existing-cover']);
    });

    it('should reject cover updates without an image file or imageObject', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        const imageStorageClient = {
            upload: sinon.stub(),
        };
        const internalRepository = createInternalRepository();
        const service = new UpdateUserCoverService({
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub(),
            },
            imageStorageClient,
            internalRepository,
            logger,
        } as any);

        try {
            await service.update({
                userId: userDetails.userId,
            });
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
            expect(err.message).to.equal('An image file or imageObject is required');
            expect(imageStorageClient.upload).to.not.have.been.called();
        }
    });
});
