import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import {
    awardCampaignBadges,
    awardCharacterBadges,
    awardNewbieBadge,
    syncRankByBadgesLength,
} from 'src/domains/users/helpers/BadgeAwardHandler';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: User :: Helpers :: BadgeAwardHandler', () => {
    let userDetails: UserDetail;

    beforeEach(() => {
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.gameInfo.badges = [];
        userDetails.gameInfo.campaigns = [];
        userDetails.gameInfo.characters = [];
    });

    it('should add newbie badge once', () => {
        awardNewbieBadge(userDetails);
        awardNewbieBadge(userDetails);

        expect(userDetails.gameInfo.badges).to.be.deep.equal(['newbie_badge']);
    });

    it('should award campaign badges with backfill', () => {
        userDetails.gameInfo.campaigns = Array.from({ length: 50 }, (_, index) => ({
            campaignId: `${index}`,
            notes: [],
        })) as UserDetail['gameInfo']['campaigns'];

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include('badge_10_campaigns');
        expect(userDetails.gameInfo.badges).to.include('badge_50_campaigns');
    });

    it('should award all campaign thresholds up to the current total', () => {
        userDetails.gameInfo.campaigns = Array.from({ length: 1000 }, (_, index) => ({
            campaignId: `${index}`,
            notes: [],
        })) as UserDetail['gameInfo']['campaigns'];

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include.members([
            'badge_10_campaigns',
            'badge_50_campaigns',
            'badge_100_campaigns',
            'badge_500_campaigns',
            'badge_1000_campaigns',
        ]);
    });

    it('should award character badges with backfill', () => {
        userDetails.gameInfo.characters = Array.from({ length: 20 }, (_, index) => `${index}`);

        awardCharacterBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include('badge_creative');
        expect(userDetails.gameInfo.badges).to.include('badge_elder');
    });

    it('should not duplicate existing badges when backfilling', () => {
        userDetails.gameInfo.badges = ['badge_10_campaigns', 'badge_creative'];
        userDetails.gameInfo.campaigns = Array.from({ length: 100 }, (_, index) => ({
            campaignId: `${index}`,
            notes: [],
        })) as UserDetail['gameInfo']['campaigns'];
        userDetails.gameInfo.characters = Array.from({ length: 20 }, (_, index) => `${index}`);

        awardCampaignBadges(userDetails);
        awardCharacterBadges(userDetails);

        expect(userDetails.gameInfo.badges.filter((badge) => badge === 'badge_10_campaigns')).to.have.lengthOf(1);
        expect(userDetails.gameInfo.badges.filter((badge) => badge === 'badge_creative')).to.have.lengthOf(1);
        expect(userDetails.gameInfo.badges).to.include('badge_100_campaigns');
        expect(userDetails.gameInfo.badges).to.include('badge_elder');
    });

    it('should set rank to diamond when user reaches 10 badges', () => {
        userDetails.gameInfo.badges = Array.from({ length: 10 }, (_, index) => `badge-${index}`);

        syncRankByBadgesLength(userDetails);

        expect(userDetails.rank).to.be.equal('diamond');
    });

    it('should set rank to gold when user reaches 20 badges', () => {
        userDetails.gameInfo.badges = Array.from({ length: 20 }, (_, index) => `badge-${index}`);

        syncRankByBadgesLength(userDetails);

        expect(userDetails.rank).to.be.equal('gold');
    });

    it('should set rank to white when user reaches 50 badges', () => {
        userDetails.gameInfo.badges = Array.from({ length: 50 }, (_, index) => `badge-${index}`);

        syncRankByBadgesLength(userDetails);

        expect(userDetails.rank).to.be.equal('white');
    });
});
