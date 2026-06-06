import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { ensureGameInfoCounters, UserGameInfoCounterKey } from './GameInfoCounters';

interface CounterBadgeRule {
    counter: UserGameInfoCounterKey;
    amount: number;
    badge: string;
}

export const CAMPAIGN_BADGE_RULES = [
    { counter: 'campaignsJoinedAmount', amount: 2, badge: 'enthusiast_badge' },
    { counter: 'campaignsJoinedAmount', amount: 5, badge: 'student_badge' },
    { counter: 'campaignsJoinedAmount', amount: 10, badge: 'mage_badge' },
    { counter: 'campaignsJoinedAmount', amount: 30, badge: 'necromant_badge' },
    { counter: 'campaignsJoinedAmount', amount: 50, badge: 'dragon_badge' },
    { counter: 'campaignsCreatedAmount', amount: 2, badge: 'cleric_badge' },
    { counter: 'campaignsCreatedAmount', amount: 5, badge: 'high_cleric_badge' },
    { counter: 'campaignsCreatedAmount', amount: 10, badge: 'sorcerer_badge' },
    { counter: 'campaignsCreatedAmount', amount: 30, badge: 'high_sorcerer_badge' },
    { counter: 'campaignsCreatedAmount', amount: 50, badge: 'supreme_sorcerer_cleric_badge' },
    { counter: 'campaignsClosedAmount', amount: 2, badge: 'warrior_badge' },
    { counter: 'campaignsClosedAmount', amount: 5, badge: 'warrior_young_badge' },
    { counter: 'campaignsClosedAmount', amount: 10, badge: 'warrior_arcane_badge' },
    { counter: 'campaignsClosedAmount', amount: 30, badge: 'warrior_darkness_badge' },
    { counter: 'campaignsClosedAmount', amount: 50, badge: 'warrior_ancient_badge' },
    { counter: 'equipBoughtAmount', amount: 10, badge: 'imp_badge' },
    { counter: 'equipBoughtAmount', amount: 30, badge: 'imp_rich_badge' },
    { counter: 'equipBoughtAmount', amount: 50, badge: 'imp_very_rich_badge' },
    { counter: 'equipBoughtAmount', amount: 70, badge: 'imp_with_glasses_and_money' },
    { counter: 'equipBoughtAmount', amount: 90, badge: 'imp_king_rich_badge' },
] as const;
export const CHARACTER_BADGE_RULES = [] as const;
export const NEWBIE_BADGE = null;
export const DONATION_BADGE_RULES = [
    { counter: 'donateAmount', amount: 10, badge: 'donate_normal' },
    { counter: 'donateAmount', amount: 50, badge: 'donate_rare' },
    { counter: 'donateAmount', amount: 100, badge: 'donate_super_rare' },
] as const;
export const BADGE_RANK_RULES = [
    { badgesAmount: 20, rank: 'white' },
    { badgesAmount: 15, rank: 'gold' },
    { badgesAmount: 10, rank: 'diamond' },
] as const;

function addBadge(userDetails: UserDetail, badge: string): UserDetail {
    ensureGameInfoCounters(userDetails);
    userDetails.gameInfo.badges = userDetails.gameInfo.badges ?? [];

    if (!userDetails.gameInfo.badges.includes(badge)) {
        userDetails.gameInfo.badges.push(badge);
    }

    return userDetails;
}

function awardBadgesByRules(userDetails: UserDetail, rules: readonly CounterBadgeRule[]): UserDetail {
    ensureGameInfoCounters(userDetails);

    for (const rule of rules) {
        const currentAmount = (userDetails.gameInfo as UserDetail['gameInfo'] & Record<UserGameInfoCounterKey, number>)[
            rule.counter
        ];
        if (currentAmount >= rule.amount) {
            addBadge(userDetails, rule.badge);
        }
    }

    return syncRankByBadgesLength(userDetails);
}

export function syncRankByBadgesLength(userDetails: UserDetail): UserDetail {
    const badgesLength = userDetails.gameInfo?.badges?.length ?? 0;
    const matchedRule = BADGE_RANK_RULES.find((rule) => badgesLength >= rule.badgesAmount);

    userDetails.rank = matchedRule?.rank ?? 'bronze';

    return userDetails;
}

export function awardNewbieBadge(userDetails: UserDetail): UserDetail {
    return userDetails;
}

export function awardCampaignBadges(userDetails: UserDetail): UserDetail {
    return awardBadgesByRules(userDetails, CAMPAIGN_BADGE_RULES);
}

export function awardCharacterBadges(userDetails: UserDetail): UserDetail {
    return userDetails;
}

export function awardDonationBadges(userDetails: UserDetail): UserDetail {
    return awardBadgesByRules(userDetails, DONATION_BADGE_RULES);
}
