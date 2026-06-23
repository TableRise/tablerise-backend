import sinon from 'sinon';
import UpdateCampaignCoverService from 'src/core/campaigns/services/UpdateCampaignCoverService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Campaigns :: Services :: UpdateCampaignCoverService', () => {
    const logger = (): void => {};
    const createInternalRepository = () => ({
        imagesForDeletion: [] as string[],
        addImageForDeletion(image?: { deleteUrl?: string; delete_url?: string } | null) {
            const deleteUrl = image?.deleteUrl ?? image?.delete_url;
            if (deleteUrl) this.imagesForDeletion.push(deleteUrl);
        },
    });

    it('should upload the campaign cover and append it to the uploader gallery', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.cover = null as any;
        const userDetails = { userDetailId: 'detail-1', gallery: [] };
        const uploaded = {
            id: 'cover-1',
            link: 'https://img.bb/cover',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const internalRepository = createInternalRepository();

        const service = new UpdateCampaignCoverService({
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            },
            imageStorageClient: {
                upload: sinon.stub().resolves(uploaded),
            },
            internalRepository,
            logger,
        } as any);

        const updated = await service.updateCover({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            picture: { originalname: 'cover.png' } as FileObject,
        });

        expect(updated.cover).to.deep.equal(uploaded);
        expect(userDetails.gallery).to.deep.equal([uploaded]);
        expect(internalRepository.imagesForDeletion).to.deep.equal([]);
    });

    it('should use the provided imageObject without calling image storage', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.cover = null as any;
        const userDetails = { userDetailId: 'detail-1', gallery: [] };
        const uploaded = {
            id: 'cover-1',
            link: 'https://img.bb/cover',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const imageStorageClient = {
            upload: sinon.stub().resolves(uploaded),
        };
        const internalRepository = createInternalRepository();

        const service = new UpdateCampaignCoverService({
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            },
            imageStorageClient,
            internalRepository,
            logger,
        } as any);

        const updated = await service.updateCover({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            imageObject: uploaded,
        });

        expect(imageStorageClient.upload).to.not.have.been.called();
        expect(updated.cover).to.deep.equal(uploaded);
        expect(userDetails.gallery).to.deep.equal([]);
        expect(internalRepository.imagesForDeletion).to.deep.equal([]);
    });

    it('should queue the previous campaign cover deleteUrl when replacing it', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.cover = {
            id: 'old-cover',
            link: 'https://img.bb/old-cover',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: 'https://img.bb/delete-old-cover',
            request: { success: true, status: 200 },
        } as any;
        const userDetails = { userDetailId: 'detail-1', gallery: [] };
        const uploaded = {
            id: 'cover-1',
            link: 'https://img.bb/cover',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const internalRepository = createInternalRepository();

        const service = new UpdateCampaignCoverService({
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            },
            imageStorageClient: {
                upload: sinon.stub().resolves(uploaded),
            },
            internalRepository,
            logger,
        } as any);

        await service.updateCover({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            picture: { originalname: 'cover.png' } as FileObject,
        });

        expect(internalRepository.imagesForDeletion).to.deep.equal(['https://img.bb/delete-old-cover']);
    });

    it('should reject cover updates without a picture or imageObject', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const service = new UpdateCampaignCoverService({
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository: {
                findOne: sinon.stub(),
                update: sinon.stub(),
            },
            imageStorageClient: {
                upload: sinon.stub(),
            },
            internalRepository: createInternalRepository(),
            logger,
        } as any);

        try {
            await service.updateCover({
                campaignId: campaign.campaignId,
                userId: 'user-1',
            });
            expect('it should not be here').to.equal(false);
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.code).to.equal(HttpStatusCode.BAD_REQUEST);
            expect(err.message).to.equal('An image file or imageObject is required');
        }
    });

    it('should persist one updated campaign cover', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const campaignsRepository = {
            update: sinon.stub().resolves(campaign),
        };
        const service = new UpdateCampaignCoverService({
            campaignsRepository,
            usersDetailsRepository: {},
            imageStorageClient: {},
            internalRepository: createInternalRepository(),
            logger,
        } as any);

        expect(await service.save(campaign)).to.deep.equal(campaign);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });
});
