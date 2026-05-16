import DatabaseManagement from '@tablerise/database-management';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import CampaignDomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import CharactersDomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import UsersDomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewCampaign, InjectNewCharacter, InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When deleting a campaign', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    const buildSpellLevel = () => ({
        spellIds: [],
        slotsTotal: 0,
        slotsExpended: 0,
    });
    const buildExtraAbilityLevel = () => ({
        extraAbilityNames: [],
        slotsTotal: 0,
        slotsExpended: 0,
    });

    const buildHighlightedJournal = (player: Campaign['campaignPlayers'][number]) => ({
        postId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
        title: 'Campaign highlight',
        author: player,
        content: 'The latest session summary.',
        timestamp: new Date().toISOString(),
        category: 'announcements' as const,
    });

    const buildPersistedCharacter = (campaignId: string): CharactersDnd => {
        const character = CharactersDomainDataFaker.generateCharactersJSON()[0] as CharactersDnd;

        character.campaignId = campaignId;
        character.data.profile.characteristics.background = 'Soldier';
        character.data.profile.characteristics.appearance.description = 'A veteran adventurer.';
        character.data.profile.characteristics.alliesAndOrgs = 'Haka';
        character.data.profile.characteristics.other = {
            languagesAndProficiencies: 'Common, Orc',
            characteristicsAndAbilities: 'Tactical and resilient',
            characteristicsAndAdditionalAbilities: 'Battle-tested',
        };
        character.data.profile.characteristics.treasure = 'A lucky coin';
        character.data.inventory = 'Rope, torch and rations';
        character.data.equipments = [];
        character.data.extraAbilities = {
            cantrips: [],
            1: buildExtraAbilityLevel(),
            2: buildExtraAbilityLevel(),
            3: buildExtraAbilityLevel(),
            4: buildExtraAbilityLevel(),
            5: buildExtraAbilityLevel(),
            6: buildExtraAbilityLevel(),
            7: buildExtraAbilityLevel(),
            8: buildExtraAbilityLevel(),
            9: buildExtraAbilityLevel(),
        };
        character.data.spells = {
            cantrips: [],
            1: buildSpellLevel(),
            2: buildSpellLevel(),
            3: buildSpellLevel(),
            4: buildSpellLevel(),
            5: buildSpellLevel(),
            6: buildSpellLevel(),
            7: buildSpellLevel(),
            8: buildSpellLevel(),
            9: buildSpellLevel(),
        };

        return character;
    };

    it('should delete campaign, remove user links and detach characters', async () => {
        const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        const secondUser = UsersDomainDataFaker.generateUsersJSON()[0] as User;
        const secondUserDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0] as UserDetail;
        const character = buildPersistedCharacter(campaign.campaignId as string);

        secondUserDetails.userId = secondUser.userId;

        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
            {
                userId: secondUser.userId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
        ];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[0]);

        secondUserDetails.gameInfo.campaigns = [{ campaignId: campaign.campaignId as string, notes: [] }] as any;

        const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');
        const authenticatedDetails = await userDetailsModel.findOne({ userId: authenticatedUserId });
        authenticatedDetails.gameInfo.campaigns = [{ campaignId: campaign.campaignId as string, notes: [] }];
        await userDetailsModel.update({ userId: authenticatedUserId }, authenticatedDetails);

        await InjectNewUser(secondUser);
        await InjectNewUserDetails(secondUserDetails, secondUser.userId);
        await InjectNewCampaign(campaign);
        await InjectNewCharacter(character);

        await requester()
            .delete(`/campaigns/${campaign.campaignId as string}`)
            .expect(HttpStatusCode.NO_CONTENT);

        await requester()
            .get(`/campaigns/${campaign.campaignId as string}`)
            .expect(HttpStatusCode.NOT_FOUND);

        const updatedAuthenticatedDetails = await userDetailsModel.findOne({ userId: authenticatedUserId });
        const updatedSecondUserDetails = await userDetailsModel.findOne({ userId: secondUser.userId });
        const charactersModel = new DatabaseManagement().modelInstance('characterDnd', 'CharactersDnd');
        const updatedCharacter = await charactersModel.findOne({ characterId: character.characterId });

        expect(updatedAuthenticatedDetails.gameInfo.campaigns).to.be.deep.equal([]);
        expect(updatedSecondUserDetails.gameInfo.campaigns).to.be.deep.equal([]);
        expect(updatedCharacter.campaignId).to.be.equal(null);
    });

    it('should forbid deleting a campaign for non dungeon_master', async () => {
        const campaign = CampaignDomainDataFaker.generateCampaignsJSON()[0];
        const dungeonMasterUser = UsersDomainDataFaker.generateUsersJSON()[0] as User;
        const dungeonMasterDetails = UsersDomainDataFaker.generateUserDetailsJSON()[0] as UserDetail;

        dungeonMasterDetails.userId = dungeonMasterUser.userId;

        campaign.campaignPlayers = [
            {
                userId: authenticatedUserId,
                characterIds: [],
                role: 'player',
                status: 'active',
            },
            {
                userId: dungeonMasterUser.userId,
                characterIds: [],
                role: 'dungeon_master',
                status: 'active',
            },
        ];
        campaign.infos.highlightedJournal = buildHighlightedJournal(campaign.campaignPlayers[1]);

        await InjectNewUser(dungeonMasterUser);
        await InjectNewUserDetails(dungeonMasterDetails, dungeonMasterUser.userId);
        await InjectNewCampaign(campaign);

        const { body } = await requester()
            .delete(`/campaigns/${campaign.campaignId as string}`)
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.be.equal('The operation is forbidden for this role');
    });
});
