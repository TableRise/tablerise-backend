import sinon from 'sinon';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import PostCampaignBuyService from 'src/core/campaigns/services/PostCampaignBuyService';

describe('Core :: Campaigns :: Services :: PostCampaignBuyService', () => {
    let postCampaignBuyService: PostCampaignBuyService;
    let campaignsRepository: any;
    let usersDetailsRepository: any;
    let campaign: Campaign;
    let userDetails: any;

    const logger = (): void => {};

    beforeEach(() => {
        campaign = DomainDataFaker.generateCampaignsJSON({ count: 1 })[0];
        campaign.campaignPlayers = [
            {
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.buys = [
            {
                name: 'Existing item',
                cost: '5 gp',
                character: 'Bard',
                user: 'existing-user',
                date: '2026-05-15',
            },
        ];
        userDetails = {
            userDetailId: 'detail-id',
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            gameInfo: {
                campaigns: [],
                characters: [],
                badges: [],
                campaignsJoinedAmount: 0,
                campaignsCreatedAmount: 0,
                campaignsClosedAmount: 0,
                equipBoughtAmount: 9,
            },
        };

        campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            updateBuys: sinon.stub().callsFake(async (_campaignId: string, buys: Campaign['buys']) => ({
                ...campaign,
                buys,
            })),
        };

        usersDetailsRepository = {
            findOne: sinon.stub().resolves(userDetails),
            update: sinon.stub().resolves(userDetails),
        };

        postCampaignBuyService = new PostCampaignBuyService({
            campaignsRepository,
            usersDetailsRepository,
            logger,
        } as any);
    });

    it('should append a new buy and persist through updateBuys', async () => {
        const payload = {
            campaignId: campaign.campaignId as string,
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            payload: {
                name: 'Potion',
                cost: '10 gp',
                character: 'Lia',
                user: 'buyer-user',
                date: '2026-05-16',
            },
        };

        const result = await postCampaignBuyService.createBuy(payload);

        expect(campaignsRepository.findOne).to.have.been.calledWith({ campaignId: campaign.campaignId });
        expect(campaignsRepository.updateBuys).to.have.been.calledWith(campaign.campaignId, [
            {
                name: 'Existing item',
                cost: '5 gp',
                character: 'Bard',
                user: 'existing-user',
                date: '2026-05-15',
            },
            payload.payload,
        ]);
        expect(result.buys).to.have.lengthOf(2);
        expect(result.buys[1]).to.deep.equal(payload.payload);
        expect(usersDetailsRepository.update).to.have.been.calledWith({
            query: { userDetailId: userDetails.userDetailId },
            payload: sinon.match
                .hasNested('gameInfo.equipBoughtAmount', 10)
                .and(sinon.match.hasNested('gameInfo.badges', ['imp'])),
        });
    });

    it('should throw when caller is not in campaign players', async () => {
        try {
            await postCampaignBuyService.createBuy({
                campaignId: campaign.campaignId as string,
                userId: 'missing-user',
                payload: {
                    name: 'Forbidden item',
                    cost: '99 gp',
                    character: 'Lia',
                    user: 'buyer-user',
                    date: '2026-05-16',
                },
            });

            expect.fail('Expected createBuy to throw');
        } catch (error) {
            const err = error as HttpRequestErrors;

            expect(err.message).to.equal('This player is not in the campaign');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
        }
    });

    it('should throw when caller user details do not exist', async () => {
        usersDetailsRepository.findOne = sinon.stub().resolves(null);

        try {
            await postCampaignBuyService.createBuy({
                campaignId: campaign.campaignId as string,
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                payload: {
                    name: 'Potion',
                    cost: '10 gp',
                    character: 'Lia',
                    user: 'buyer-user',
                    date: '2026-05-16',
                },
            });

            expect.fail('Expected createBuy to throw');
        } catch (error) {
            const err = error as HttpRequestErrors;

            expect(err.message).to.equal('User does not exist');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
        }
    });

    it('should initialize buys when the campaign has none', async () => {
        campaign.buys = undefined as any;

        const result = await postCampaignBuyService.createBuy({
            campaignId: campaign.campaignId as string,
            userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
            payload: {
                name: 'Torch',
                cost: '1 gp',
                character: 'Lia',
                user: 'buyer-user',
                date: '2026-05-16',
            },
        });

        expect(result.buys).to.deep.equal([
            {
                name: 'Torch',
                cost: '1 gp',
                character: 'Lia',
                user: 'buyer-user',
                date: '2026-05-16',
            },
        ]);
    });
});
