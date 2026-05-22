import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export const CAMPAIGN_BADGE_RULES = [
    { threshold: 10, badge: 'badge_10_campaigns' },
    { threshold: 50, badge: 'badge_50_campaigns' },
    { threshold: 100, badge: 'badge_100_campaigns' },
    { threshold: 500, badge: 'badge_500_campaigns' },
    { threshold: 1000, badge: 'badge_1000_campaigns' },
] as const;

export const CHARACTER_BADGE_RULES = [
    { threshold: 10, badge: 'badge_creative' },
    { threshold: 20, badge: 'badge_elder' },
] as const;

export const NEWBIE_BADGE = 'badge_newbie';
export const BADGE_RANK_RULES = [
    { threshold: 50, rank: 'white' },
    { threshold: 20, rank: 'gold' },
    { threshold: 10, rank: 'diamond' },
] as const;

function ensureBadges(userDetails: UserDetail): string[] {
    if (!userDetails.gameInfo) {
        userDetails.gameInfo = {
            campaigns: [],
            characters: [],
            badges: [],
        };
    }

    if (!Array.isArray(userDetails.gameInfo.badges)) {
        userDetails.gameInfo.badges = [];
    }

    return userDetails.gameInfo.badges;
}

export function syncRankByBadgesLength(userDetails: UserDetail): UserDetail {
    const currentBadges = ensureBadges(userDetails);
    const matchedRule = BADGE_RANK_RULES.find((rule) => currentBadges.length >= rule.threshold);

    if (!matchedRule) return userDetails;

    userDetails.rank = matchedRule.rank;

    return userDetails;
}

function addBadges(userDetails: UserDetail, badges: string[]): UserDetail {
    const currentBadges = ensureBadges(userDetails);

    badges.forEach((badge) => {
        if (!currentBadges.includes(badge)) currentBadges.push(badge);
    });

    syncRankByBadgesLength(userDetails);

    return userDetails;
}

export function awardNewbieBadge(userDetails: UserDetail): UserDetail {
    return addBadges(userDetails, [NEWBIE_BADGE]);
}

export function awardCampaignBadges(userDetails: UserDetail): UserDetail {
    const campaignsLength = userDetails.gameInfo?.campaigns?.length ?? 0;
    const badgesToAdd = CAMPAIGN_BADGE_RULES.filter((rule) => campaignsLength >= rule.threshold).map(
        (rule) => rule.badge
    );

    return addBadges(userDetails, badgesToAdd);
}

export function awardCharacterBadges(userDetails: UserDetail): UserDetail {
    const charactersLength = userDetails.gameInfo?.characters?.length ?? 0;
    const badgesToAdd = CHARACTER_BADGE_RULES.filter((rule) => charactersLength >= rule.threshold).map(
        (rule) => rule.badge
    );

    return addBadges(userDetails, badgesToAdd);
}
