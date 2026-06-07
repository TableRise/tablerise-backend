import sinon from 'sinon';
import UpdateCampaignCoverService from 'src/core/campaigns/services/UpdateCampaignCoverService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { FileObject } from 'src/types/shared/file';

describe('Core :: Campaigns :: Services :: UpdateCampaignCoverService', () => {
    const logger = (): void => {};

    it('should upload the campaign cover and append it to the uploader gallery', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
        const userDetails = { userDetailId: 'detail-1', gallery: [] };
        const uploaded = {
            id: 'cover-1',
            link: 'https://img.bb/cover',
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        };

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
            logger,
        } as any);

        const updated = await service.updateCover({
            campaignId: campaign.campaignId,
            userId: 'user-1',
            picture: { originalname: 'cover.png' } as FileObject,
        });

        expect(updated.cover).to.deep.equal(uploaded);
        expect(userDetails.gallery).to.deep.equal([uploaded]);
    });

    it('should use the provided imageObject without calling image storage', async () => {
        const campaign = DomainDataFaker.generateCampaignsJSON()[0];
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
            logger,
        } as any);

        expect(await service.save(campaign)).to.deep.equal(campaign);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });
});
