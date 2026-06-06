import sinon from 'sinon';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import UpdateUserCoverService from 'src/core/users/services/users/UpdateUserCoverService';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Users :: Services :: Users :: UpdateUserCoverService', () => {
    const logger = (): void => {};

    it('should upload and persist the new cover image', async () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
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
        const service = new UpdateUserCoverService({
            usersDetailsRepository,
            imageStorageClient,
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
    });

    it('should throw when the user details do not exist', async () => {
        const usersDetailsRepository = {
            findOne: sinon.stub().resolves(null),
            update: sinon.stub(),
        };
        const imageStorageClient = {
            upload: sinon.stub(),
        };
        const service = new UpdateUserCoverService({
            usersDetailsRepository,
            imageStorageClient,
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
});
