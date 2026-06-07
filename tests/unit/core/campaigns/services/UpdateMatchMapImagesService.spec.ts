import sinon from 'sinon';
import UpdateMatchMapImagesService from 'src/core/campaigns/services/UpdateMatchMapImagesService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Camapaigns :: Services :: UpdateMatchMapImagesService', () => {
    const logger = (): void => {};

    it('should append uploaded map images to match data and uploader gallery', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const userDetails = { userDetailId: 'detail-1', gallery: [] };
        const uploaded = {
            id: 'map-1',
            link: 'https://img.bb/map',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };

        const service = new UpdateMatchMapImagesService({
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

        const updated = await service.updateMatchMapImage({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            mapImages: [{}],
        } as any);

        expect(updated.matchData?.mapImages.at(-1)).to.deep.equal(uploaded);
        expect(userDetails.gallery).to.deep.equal([uploaded]);
    });

    it('should skip gallery persistence when no files are uploaded', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const usersDetailsRepository = {
            findOne: sinon.stub(),
            update: sinon.stub(),
        };

        const service = new UpdateMatchMapImagesService({
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

        await service.updateMatchMapImage({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            mapImages: undefined as any,
        });

        expect(usersDetailsRepository.findOne).to.not.have.been.called();
    });

    it('should use provided imageObject items without calling image storage', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const uploaded = {
            id: 'map-1',
            link: 'https://img.bb/map',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };
        const imageStorageClient = {
            upload: sinon.stub().resolves(uploaded),
        };

        const service = new UpdateMatchMapImagesService({
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

        const updated = await service.updateMatchMapImage({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            imageObject: [uploaded],
        } as any);

        expect(imageStorageClient.upload).to.not.have.been.called();
        expect(updated.matchData?.mapImages.at(-1)).to.deep.equal(uploaded);
    });

    it('should persist campaigns through save', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const campaignsRepository = {
            update: sinon.stub().resolves(campaign),
        };

        const service = new UpdateMatchMapImagesService({
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
