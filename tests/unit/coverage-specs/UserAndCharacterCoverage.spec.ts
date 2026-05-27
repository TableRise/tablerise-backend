import sinon from 'sinon';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import CharacterDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import AddCampaignNoteOperation from 'src/core/users/operations/users/AddCampaignNoteOperation';
import AddCampaignNoteService from 'src/core/users/services/users/AddCampaignNoteService';
import CharacterAutomationBuilders from 'src/domains/characters/helpers/CharacterAutomationBuilders';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';

describe('Coverage :: Users and Characters Expansion', () => {
    const logger = (): void => {};

    it('should cover AddCampaignNoteOperation delegation', async () => {
        const player = { userId: 'player-1', notes: [{ title: 'A', content: 'B' }] };
        const addCampaignNoteService = { add: sinon.stub().resolves(player) };
        const operation = new AddCampaignNoteOperation({ addCampaignNoteService, logger } as any);

        const payload = {
            userId: 'player-1',
            campaignId: 'campaign-1',
            note: { title: 'A', content: 'B' },
        } as any;

        expect(await operation.execute(payload)).to.equal(player);
        expect(addCampaignNoteService.add).to.have.been.calledWith(payload);
    });

    it('should cover AddCampaignNoteService success path', async () => {
        const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [
            {
                userId: 'player-1',
                role: 'player',
                status: 'active',
                characterIds: [],
                notes: [],
            },
        ] as any;

        const campaignsRepository = {
            findOne: sinon.stub().resolves(campaign),
            update: sinon.stub().callsFake(async ({ payload }) => payload),
        };

        const service = new AddCampaignNoteService({
            usersDetailsRepository: {},
            campaignsRepository,
            logger,
        } as any);

        const result = await service.add({
            userId: 'player-1',
            campaignId: campaign.campaignId,
            note: { title: 'Plan', content: 'Scout first' },
        } as any);

        expect(result.notes).to.deep.equal([{ title: 'Plan', content: 'Scout first' }]);
        expect(campaignsRepository.update).to.have.been.calledWith({
            query: { campaignId: campaign.campaignId },
            payload: campaign,
        });
    });

    it('should cover AddCampaignNoteService error branches', async () => {
        const serviceWithMissingCampaign = new AddCampaignNoteService({
            usersDetailsRepository: {},
            campaignsRepository: {
                findOne: sinon.stub().resolves(null),
                update: sinon.stub(),
            },
            logger,
        } as any);

        try {
            await serviceWithMissingCampaign.add({
                userId: 'player-1',
                campaignId: 'campaign-1',
                note: { title: 'Plan', content: 'Scout first' },
            } as any);
            expect.fail('expected campaign missing error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('Campaign does not exist');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
        }

        const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        campaign.campaignPlayers = [];

        const serviceWithMissingPlayer = new AddCampaignNoteService({
            usersDetailsRepository: {},
            campaignsRepository: {
                findOne: sinon.stub().resolves(campaign),
                update: sinon.stub(),
            },
            logger,
        } as any);

        try {
            await serviceWithMissingPlayer.add({
                userId: 'player-1',
                campaignId: campaign.campaignId,
                note: { title: 'Plan', content: 'Scout first' },
            } as any);
            expect.fail('expected campaign player missing error');
        } catch (error) {
            const err = error as HttpRequestErrors;
            expect(err.message).to.equal('This player is not in the campaign');
            expect(err.code).to.equal(HttpStatusCode.NOT_FOUND);
            expect(err.name).to.equal(getErrorName(HttpStatusCode.NOT_FOUND));
        }
    });

    it('should cover CharacterAutomationBuilders ability score automation', () => {
        const character = CharacterDomainDataFaker.generateCharactersJSON()[0];
        character.data.stats.abilityScores = [
            { ability: 'str', value: 10, modifier: 0, proficiency: false },
            { ability: 'dex', value: 12, modifier: 1, proficiency: false },
        ] as any;

        const raceRules = {
            abilityScoreIncrease: [
                { name: 'STR', value: 2 },
                { name: 'dex', value: 1 },
            ],
        } as any;

        const automated = CharacterAutomationBuilders.automateCharacterAbilityScores(character as any, raceRules);

        expect(automated.data.stats.abilityScores).to.deep.equal([
            { ability: 'str', value: 12, modifier: 0, proficiency: false },
            { ability: 'dex', value: 13, modifier: 1, proficiency: false },
        ]);
    });
});
