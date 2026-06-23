import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import {
    addBadgeIfMissing,
    finalizeProgression,
    getManualXpBadge,
    levelFromXP,
    rankFromXP,
    roundTo10,
    snapshotProgression,
    syncRankToXP,
    totalXPToLevel,
} from 'src/domains/users/helpers/UserProgression';

describe('Domains :: User :: Helpers :: UserProgression', () => {
    it('should round values to the nearest 10', () => {
        expect(roundTo10(4)).to.equal(0);
        expect(roundTo10(5)).to.equal(10);
        expect(roundTo10(44)).to.equal(40);
        expect(roundTo10(45)).to.equal(50);
    });

    it('should derive levels from boundary xp values', () => {
        expect(totalXPToLevel(1)).to.equal(0);
        expect(totalXPToLevel(2)).to.equal(200);
        expect(totalXPToLevel(3)).to.equal(510);

        expect(levelFromXP(0)).to.equal(1);
        expect(levelFromXP(199)).to.equal(1);
        expect(levelFromXP(200)).to.equal(2);
        expect(levelFromXP(509)).to.equal(2);
        expect(levelFromXP(510)).to.equal(3);
    });

    it('should derive ranks from boundary xp values', () => {
        expect(rankFromXP(0)).to.equal('bronze');
        expect(rankFromXP(2499)).to.equal('bronze');
        expect(rankFromXP(2500)).to.equal('diamond');
        expect(rankFromXP(6499)).to.equal('diamond');
        expect(rankFromXP(6500)).to.equal('gold');
        expect(rankFromXP(11499)).to.equal('gold');
        expect(rankFromXP(11500)).to.equal('emerald');
        expect(rankFromXP(18999)).to.equal('emerald');
        expect(rankFromXP(19000)).to.equal('amethyst');
        expect(rankFromXP(27999)).to.equal('amethyst');
        expect(rankFromXP(28000)).to.equal('divine');
    });

    it('should award badge xp per newly added badge', () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = 0;
        userDetails.rank = 'bronze';
        userDetails.gameInfo.badges = [];

        const snapshot = snapshotProgression(userDetails);

        addBadgeIfMissing(userDetails, 'enthusiast');
        addBadgeIfMissing(userDetails, 'cleric');
        finalizeProgression(userDetails, snapshot);

        expect(userDetails.xp).to.equal(800);
    });

    it('should not award badge xp for the newbie badge', () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = 0;
        userDetails.level = 1;
        userDetails.rank = 'bronze';
        userDetails.gameInfo.badges = [];
        userDetails.gameInfo.userLevelAmount = 0;

        const snapshot = snapshotProgression(userDetails);

        addBadgeIfMissing(userDetails, 'newbie');
        finalizeProgression(userDetails, snapshot);

        expect(userDetails.xp).to.equal(0);
        expect(userDetails.level).to.equal(1);
        expect(userDetails.gameInfo.userLevelAmount).to.equal(0);
    });

    it('should award rank-change xp only once per finalize call when multiple tiers are crossed', () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = 1000;
        userDetails.rank = 'bronze';
        userDetails.gameInfo.badges = [];

        const snapshot = snapshotProgression(userDetails);

        userDetails.xp += 7200;

        finalizeProgression(userDetails, snapshot);

        expect(userDetails.rank).to.equal('gold');
        expect(userDetails.xp).to.equal(9000);
        expect(userDetails.gameInfo.userLevelAmount).to.equal(levelFromXP(9000) - levelFromXP(1000));
    });

    it('should award the supreme badge when the user reaches level 30', () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = totalXPToLevel(30);
        userDetails.level = 30;
        userDetails.rank = 'bronze';
        userDetails.gameInfo.badges = [];
        userDetails.gameInfo.userLevelAmount = 0;

        const snapshot = {
            ...snapshotProgression(userDetails),
            level: 29,
        };

        finalizeProgression(userDetails, snapshot);

        expect(userDetails.gameInfo.badges).to.include('supreme');
        expect(userDetails.xp).to.equal(totalXPToLevel(30) + 1200);
        expect(userDetails.gameInfo.userLevelAmount).to.equal(userDetails.level - 29);
    });

    it('should expose the exact manual xp badge triggers', () => {
        expect(getManualXpBadge(777)).to.equal('donate_normal');
        expect(getManualXpBadge(999)).to.equal('donate_rare');
        expect(getManualXpBadge(1111)).to.equal('donate_super_rare');
        expect(getManualXpBadge(500)).to.equal(undefined);
    });

    it('should sync the stored rank from xp using lowercase values', () => {
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = 12500;
        userDetails.rank = 'bronze';

        syncRankToXP(userDetails);

        expect(userDetails.rank).to.equal('emerald');
    });
});
