import sinon from 'sinon';
import UpdateMatchImagesService from 'src/core/campaigns/services/UpdateMatchImagesService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Campaigns :: Services :: UpdateMatchImagesService', () => {
    const logger = (): void => {};

    it('should append uploaded images to match data and uploader gallery', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.images = campaign.matchData.images ?? [];
        const userDetails = { userDetailId: 'detail-1', gallery: [] };
        const uploaded = {
            id: 'image-123',
            link: 'https://img.bb/gallery',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };

        const service = new UpdateMatchImagesService({
            campaignsRepository: {
                findOne: sinon.stub().resolves({ ...campaign }),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves(userDetails),
                update: sinon.stub().resolves(userDetails),
            },
            imageStorageClient: {
                upload: sinon.stub().resolves(uploaded),
            },
            logger,
        } as any);

        const updated = await service.updateMatchImages({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            images: [{}],
        } as any);

        expect(updated.matchData.images.at(-1)).to.deep.equal(uploaded);
        expect(userDetails.gallery).to.deep.equal([uploaded]);
    });

    it('should initialize the match images list when it is missing', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.images = undefined as any;
        const uploaded = {
            id: 'image-123',
            link: 'https://img.bb/gallery',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };

        const service = new UpdateMatchImagesService({
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves({ userDetailId: 'detail-1', gallery: [] }),
                update: sinon.stub().resolves({}),
            },
            imageStorageClient: {
                upload: sinon.stub(),
            },
            logger,
        } as any);

        const updated = await service.updateMatchImages({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            imageObject: [uploaded],
        } as any);

        expect(updated.matchData.images).to.deep.equal([uploaded]);
    });

    it('should skip uploads when images are missing', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const usersDetailsRepository = {
            findOne: sinon.stub(),
            update: sinon.stub(),
        };

        const service = new UpdateMatchImagesService({
            campaignsRepository: {
                findOne: sinon.stub().resolves({ ...campaign }),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository,
            imageStorageClient: {
                upload: sinon.stub(),
            },
            logger,
        } as any);

        await service.updateMatchImages({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            images: undefined as any,
        });

        expect(usersDetailsRepository.findOne).to.not.have.been.called();
    });

    it('should return the campaign untouched when match data is missing', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData = undefined as any;
        const usersDetailsRepository = {
            findOne: sinon.stub(),
            update: sinon.stub(),
        };

        const service = new UpdateMatchImagesService({
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository,
            imageStorageClient: {
                upload: sinon.stub(),
            },
            logger,
        } as any);

        const updated = await service.updateMatchImages({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            images: [{}],
        } as any);

        expect(updated).to.equal(campaign);
        expect(usersDetailsRepository.findOne).to.not.have.been.called();
    });

    it('should use provided imageObject items without calling image storage', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.images = campaign.matchData.images ?? [];
        const uploaded = {
            id: 'image-123',
            link: 'https://img.bb/gallery',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const imageStorageClient = {
            upload: sinon.stub().resolves(uploaded),
        };

        const service = new UpdateMatchImagesService({
            campaignsRepository: {
                findOne: sinon.stub().resolves({ ...campaign }),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository: {
                findOne: sinon.stub().resolves({ userDetailId: 'detail-1', gallery: [] }),
                update: sinon.stub().resolves({}),
            },
            imageStorageClient,
            logger,
        } as any);

        const updated = await service.updateMatchImages({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            imageObject: [uploaded],
        } as any);

        expect(imageStorageClient.upload).to.not.have.been.called();
        expect(updated.matchData.images.at(-1)).to.deep.equal(uploaded);
    });

    it('should skip gallery persistence when no images are uploaded', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        campaign.matchData.images = campaign.matchData.images ?? [];
        const previousLength = campaign.matchData.images.length;
        const usersDetailsRepository = {
            findOne: sinon.stub(),
            update: sinon.stub(),
        };

        const service = new UpdateMatchImagesService({
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub().resolves(campaign),
            },
            usersDetailsRepository,
            imageStorageClient: {
                upload: sinon.stub(),
            },
            logger,
        } as any);

        const updated = await service.updateMatchImages({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            imageObject: [],
        } as any);

        expect(updated.matchData.images).to.have.lengthOf(previousLength);
        expect(usersDetailsRepository.findOne).to.not.have.been.called();
    });

    it('should persist the updated campaign', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const campaignsRepository = {
            update: sinon.stub().resolves(campaign),
        };

        const service = new UpdateMatchImagesService({
            campaignsRepository,
            usersDetailsRepository: {},
            imageStorageClient: {},
            logger,
        } as any);

        expect(await service.save(campaign)).to.deep.equal(campaign);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });
});
