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
        userDetails.rank = 'existing-rank';
    });

    it('should keep newbie badge flow disabled', () => {
        awardNewbieBadge(userDetails);

        expect(userDetails.gameInfo.badges).to.deep.equal([]);
    });

    it('should add joined and created badges when thresholds are reached', () => {
        userDetails.gameInfo.campaignsJoinedAmount = 5;
        userDetails.gameInfo.campaignsCreatedAmount = 2;

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include.members(['enthusiast-badge', 'student-badge', 'cleric-badge']);
    });

    it('should add equipment buy badges when thresholds are reached', () => {
        userDetails.gameInfo.equipBoughtAmount = 30;

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include.members(['imp-badge', 'imp-rich-badge']);
    });

    it('should award the higher closed-campaign badges at later thresholds', () => {
        userDetails.gameInfo.campaignsClosedAmount = 50;

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include.members([
            'warrior-badge',
            'warrior-young-badge',
            'warrior-arcane-badge',
            'warrior-darkness-badge',
            'warrior-ancient-badge',
        ]);
    });

    it('should keep character badge flow disabled', () => {
        awardCharacterBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.deep.equal([]);
    });

    it('should sync rank to diamond, gold, white, and null based on badge count', () => {
        userDetails.gameInfo.badges = Array.from({ length: 10 }, (_, index) => `badge-${index}`);
        syncRankByBadgesLength(userDetails);
        expect(userDetails.rank).to.equal('diamond');

        userDetails.gameInfo.badges = Array.from({ length: 15 }, (_, index) => `badge-${index}`);
        syncRankByBadgesLength(userDetails);
        expect(userDetails.rank).to.equal('gold');

        userDetails.gameInfo.badges = Array.from({ length: 20 }, (_, index) => `badge-${index}`);
        syncRankByBadgesLength(userDetails);
        expect(userDetails.rank).to.equal('white');

        userDetails.gameInfo.badges = ['only-one'];
        syncRankByBadgesLength(userDetails);
        expect(userDetails.rank).to.equal(null);
    });
});
