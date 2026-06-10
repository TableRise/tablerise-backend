import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import {
    awardCampaignBadges,
    awardCharacterBadges,
    awardDonationBadges,
    awardFriendBadges,
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

        expect(userDetails.gameInfo.badges).to.include.members(['enthusiast', 'student', 'cleric']);
    });

    it('should add equipment buy badges when thresholds are reached', () => {
        userDetails.gameInfo.equipBoughtAmount = 30;

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include.members(['imp', 'imp_rich']);
    });

    it('should not duplicate badges that the user already has', () => {
        userDetails.gameInfo.badges = ['enthusiast'];
        userDetails.gameInfo.campaignsJoinedAmount = 5;

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges.filter((badge) => badge === 'enthusiast')).to.have.length(1);
        expect(userDetails.gameInfo.badges).to.include('student');
    });

    it('should award the higher closed-campaign badges at later thresholds', () => {
        userDetails.gameInfo.campaignsClosedAmount = 50;

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include.members([
            'warrior',
            'warrior_young',
            'warrior_arcane',
            'warrior_darkness',
            'warrior_ancient',
        ]);
    });

    it('should initialize badges when the array is missing', () => {
        delete (userDetails.gameInfo as any).badges;
        userDetails.gameInfo.campaignsJoinedAmount = 2;

        awardCampaignBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.deep.equal(['enthusiast']);
    });

    it('should keep character badge flow disabled', () => {
        awardCharacterBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.deep.equal([]);
    });

    it('should award donation badges based on the cumulative donation amount', () => {
        userDetails.gameInfo.donateAmount = 100;

        awardDonationBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include.members(['donate_normal', 'donate_rare', 'donate_super_rare']);
    });

    it('should award friend badges based on the cumulative playersAdded counter', () => {
        userDetails.gameInfo.playersAdded = 35;

        awardFriendBadges(userDetails);

        expect(userDetails.gameInfo.badges).to.include.members(['friends', 'friends_rare', 'friends_super_rare']);
        expect(userDetails.gameInfo.badges).to.have.length(3);
    });

    it('should not duplicate friend badges that the user already has', () => {
        userDetails.gameInfo.badges = ['friends'];
        userDetails.gameInfo.playersAdded = 15;

        awardFriendBadges(userDetails);

        expect(userDetails.gameInfo.badges.filter((badge) => badge === 'friends')).to.have.length(1);
        expect(userDetails.gameInfo.badges).to.include('friends_rare');
    });

    it('should sync rank to bronze, diamond, gold, and white based on badge count', () => {
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
        expect(userDetails.rank).to.equal('bronze');
    });

    it('should keep bronze rank when gameInfo or badges are missing', () => {
        delete (userDetails as any).gameInfo;

        syncRankByBadgesLength(userDetails);

        expect(userDetails.rank).to.equal('bronze');
    });
});
