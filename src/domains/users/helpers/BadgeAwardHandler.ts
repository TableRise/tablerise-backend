import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { ensureGameInfoCounters, UserGameInfoCounterKey } from './GameInfoCounters';

interface CounterBadgeRule {
    counter: UserGameInfoCounterKey;
    amount: number;
    badge: string;
}

export const CAMPAIGN_BADGE_RULES = [
    { counter: 'campaignsJoinedAmount', amount: 2, badge: 'enthusiast-badge' },
    { counter: 'campaignsJoinedAmount', amount: 5, badge: 'student-badge' },
    { counter: 'campaignsJoinedAmount', amount: 10, badge: 'mage-badge' },
    { counter: 'campaignsJoinedAmount', amount: 30, badge: 'necromant-badge' },
    { counter: 'campaignsJoinedAmount', amount: 50, badge: 'dragon-badge' },
    { counter: 'campaignsCreatedAmount', amount: 2, badge: 'cleric-badge' },
    { counter: 'campaignsCreatedAmount', amount: 5, badge: 'high-cleric-badge' },
    { counter: 'campaignsCreatedAmount', amount: 10, badge: 'sorcerer-badge' },
    { counter: 'campaignsCreatedAmount', amount: 30, badge: 'high-sorcerer-badge' },
    { counter: 'campaignsCreatedAmount', amount: 50, badge: 'supreme-sorcerer-cleric-badge' },
    { counter: 'campaignsClosedAmount', amount: 2, badge: 'warrior-badge' },
    { counter: 'campaignsClosedAmount', amount: 5, badge: 'warrior-young-badge' },
    { counter: 'campaignsClosedAmount', amount: 10, badge: 'warrior-arcane-badge' },
    { counter: 'campaignsClosedAmount', amount: 30, badge: 'warrior-darkness-badge' },
    { counter: 'campaignsClosedAmount', amount: 50, badge: 'warrior-ancient-badge' },
    { counter: 'equipBoughtAmount', amount: 10, badge: 'imp-badge' },
    { counter: 'equipBoughtAmount', amount: 30, badge: 'imp-rich-badge' },
    { counter: 'equipBoughtAmount', amount: 50, badge: 'imp-very-rich-badge' },
    { counter: 'equipBoughtAmount', amount: 70, badge: 'imp-with-glasses-and-money' },
    { counter: 'equipBoughtAmount', amount: 90, badge: 'imp-king-rich-badge' },
] as const;
export const CHARACTER_BADGE_RULES = [] as const;
export const NEWBIE_BADGE = null;
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

    userDetails.rank = matchedRule?.rank ?? '';

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
