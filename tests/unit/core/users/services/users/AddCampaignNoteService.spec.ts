import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import AddCampaignNoteService from 'src/core/users/services/users/AddCampaignNoteService';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';

describe('Core :: Users :: Services :: AddCampaignNoteService', () => {
    let addCampaignNoteService: AddCampaignNoteService;
    let campaignsRepository: any;
    let campaign: Campaign;

    const logger = (): void => {};

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: 'player-id',
                characterIds: [],
                notes: undefined,
                role: 'player',
                status: 'active',
            },
        ] as any;

        campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        addCampaignNoteService = new AddCampaignNoteService({
            campaignsRepository,
            usersDetailsRepository: {},
            logger,
        } as any);
    });

    it('should initialize notes when missing and append the new note', async () => {
        const result = await addCampaignNoteService.add({
            userId: 'player-id',
            campaignId: campaign.campaignId as string,
            note: { title: 'Plan', content: 'Bring torches' } as any,
        });

        expect(result.notes).to.deep.equal([{ title: 'Plan', content: 'Bring torches' }]);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });

    it('should throw when the campaign does not exist', async () => {
        campaignsRepository.findOne = sinon.stub().resolves(null);

        addCampaignNoteService = new AddCampaignNoteService({
            campaignsRepository,
            usersDetailsRepository: {},
            logger,
        } as any);

        try {
            await addCampaignNoteService.add({
                userId: 'player-id',
                campaignId: 'missing-campaign',
                note: { title: 'Plan', content: 'Bring torches' } as any,
            });
            expect.fail('Expected missing campaign error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('Campaign does not exist');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
        }
    });

    it('should throw when the player is not part of the campaign', async () => {
        try {
            await addCampaignNoteService.add({
                userId: 'other-player',
                campaignId: campaign.campaignId as string,
                note: { title: 'Plan', content: 'Bring torches' } as any,
            });
            expect.fail('Expected missing player error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('This player is not in the campaign');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
        }
    });
});
