import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { ensureGameInfoCounters } from './GameInfoCounters';

export const DEFAULT_USER_TITLE = 'Novato(a) na Taverna';
export const DEFAULT_USER_PROFILE_PICTURE_LINK =
    'https://i.ibb.co/gZSWpVM7/Chat-GPT-Image-23-de-mai-de-2026-14-04-30.png';
export const SUPREME_BADGE = 'supreme';
export const NON_XP_REWARD_BADGES = new Set(['newbie']);
export const USER_RANK_RULES = [
    { rank: 'bronze', xp: 0 },
    { rank: 'diamond', xp: 2500 },
    { rank: 'gold', xp: 6500 },
    { rank: 'emerald', xp: 11500 },
    { rank: 'amethyst', xp: 19000 },
    { rank: 'divine', xp: 28000 },
] as const;

export const USER_XP_EVENTS = {
    LOGIN: 30,
    ADD_FRIEND: 100,
    CAMPAIGN_ENTRY: 200,
    CAMPAIGN_CREATION: 300,
    CAMPAIGN_COMPLETION: 200,
    CAMPAIGN_APPROVAL_BONUS: 50,
    CAMPAIGN_ADMIN_GRANT: 150,
    BADGE_GAIN: 400,
    RANK_CHANGE: 800,
    FIRST_CUSTOM_PROFILE_PICTURE: 100,
    FIRST_PROFILE_COVER: 100,
    CHARACTER_CREATION: 100,
    CHARACTER_EQUIPMENT_ADDITION: 20,
    CAMPAIGN_JOURNAL_POST: 20,
} as const;

export const MANUAL_XP_BADGE_RULES: Record<number, string> = {
    777: 'donate_normal',
    999: 'donate_rare',
    1111: 'donate_super_rare',
};

export interface ProgressionSnapshot {
    badges: Set<string>;
    rank: string;
    level: number;
}

function normalizeXpValue(xp: unknown): number {
    if (typeof xp !== 'number' || Number.isNaN(xp) || !Number.isFinite(xp)) return 0;
    return Math.max(0, Math.trunc(xp));
}

function ensureBadges(userDetails: UserDetail): string[] {
    ensureGameInfoCounters(userDetails);

    if (!Array.isArray(userDetails.gameInfo.badges)) {
        userDetails.gameInfo.badges = [];
    }

    return userDetails.gameInfo.badges;
}

export function roundTo10(value: number): number {
    return Math.round(value / 10) * 10;
}

export function totalXPToLevel(level: number): number {
    if (level <= 1) return 0;

    const baseLevel = level - 1;
    return roundTo10(120 * baseLevel ** 1.55 + 80 * baseLevel);
}

export function levelFromXP(xp: number): number {
    const normalizedXp = normalizeXpValue(xp);
    let currentLevel = 1;

    while (totalXPToLevel(currentLevel + 1) <= normalizedXp) {
        currentLevel += 1;
    }

    return currentLevel;
}

export function rankFromXP(xp: number): string {
    const normalizedXp = normalizeXpValue(xp);
    let currentRank = USER_RANK_RULES[0].rank;

    for (const rule of USER_RANK_RULES) {
        if (normalizedXp >= rule.xp) {
            currentRank = rule.rank;
        }
    }

    return currentRank;
}

export function syncLevelToXP(userDetails: UserDetail): UserDetail {
    userDetails.xp = normalizeXpValue(userDetails.xp);
    userDetails.level = levelFromXP(userDetails.xp);

    return userDetails;
}

export function syncRankToXP(userDetails: UserDetail): UserDetail {
    userDetails.xp = normalizeXpValue(userDetails.xp);
    userDetails.rank = rankFromXP(userDetails.xp);

    return userDetails;
}

export function addXp(userDetails: UserDetail, amount: number): UserDetail {
    userDetails.xp = normalizeXpValue(userDetails.xp) + Math.max(0, Math.trunc(amount));
    userDetails.level = levelFromXP(userDetails.xp);

    return userDetails;
}

export function addBadgeIfMissing(userDetails: UserDetail, badge: string): boolean {
    const badges = ensureBadges(userDetails);

    if (badges.includes(badge)) return false;

    badges.push(badge);
    return true;
}

export function snapshotProgression(userDetails: UserDetail): ProgressionSnapshot {
    syncLevelToXP(userDetails);

    return {
        badges: new Set(ensureBadges(userDetails)),
        rank: userDetails.rank ?? 'bronze',
        level: userDetails.level,
    };
}

function rewardNewBadges(
    userDetails: UserDetail,
    rewardedBadges: Set<string>
): { rewarded: number; newlyRewardedBadges: string[] } {
    const badges = ensureBadges(userDetails);
    const newBadges = badges.filter((badge) => !rewardedBadges.has(badge));
    const xpRewardBadges = newBadges.filter((badge) => !NON_XP_REWARD_BADGES.has(badge));

    if (!newBadges.length) {
        return { rewarded: 0, newlyRewardedBadges: [] };
    }

    newBadges.forEach((badge) => rewardedBadges.add(badge));
    if (xpRewardBadges.length) {
        addXp(userDetails, USER_XP_EVENTS.BADGE_GAIN * xpRewardBadges.length);
    }

    return { rewarded: newBadges.length, newlyRewardedBadges: newBadges };
}

function applyLevelBadgesUntilStable(userDetails: UserDetail, rewardedBadges: Set<string>): void {
    let shouldContinue = true;

    while (shouldContinue) {
        shouldContinue = false;
        syncLevelToXP(userDetails);

        if (userDetails.level >= 30 && addBadgeIfMissing(userDetails, SUPREME_BADGE)) {
            shouldContinue = true;
        }

        const { rewarded } = rewardNewBadges(userDetails, rewardedBadges);
        if (rewarded) {
            shouldContinue = true;
        }
    }
}

export function finalizeProgression(userDetails: UserDetail, snapshot: ProgressionSnapshot): UserDetail {
    ensureGameInfoCounters(userDetails);
    const rewardedBadges = new Set(snapshot.badges);

    applyLevelBadgesUntilStable(userDetails, rewardedBadges);
    syncRankToXP(userDetails);

    if ((userDetails.rank ?? 'bronze') !== snapshot.rank) {
        addXp(userDetails, USER_XP_EVENTS.RANK_CHANGE);
    }

    applyLevelBadgesUntilStable(userDetails, rewardedBadges);
    syncLevelToXP(userDetails);
    syncRankToXP(userDetails);

    const levelGained = Math.max(0, userDetails.level - snapshot.level);
    userDetails.gameInfo.userLevelAmount += levelGained;

    return userDetails;
}

export function getManualXpBadge(amount: number): string | undefined {
    return MANUAL_XP_BADGE_RULES[amount];
}
