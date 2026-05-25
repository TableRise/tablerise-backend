import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';

export type UserGameInfoCounterKey =
    | 'campaignsJoinedAmount'
    | 'campaignsCreatedAmount'
    | 'campaignsClosedAmount'
    | 'equipBoughtAmount';

export function ensureGameInfoCounters(userDetails: UserDetail): UserDetail {
    if (!userDetails.gameInfo) {
        userDetails.gameInfo = {
            campaigns: [],
            characters: [],
            badges: [],
        } as UserDetail['gameInfo'];
    }

    const gameInfo = userDetails.gameInfo as Record<string, unknown>;

    if (typeof gameInfo.campaignsJoinedAmount !== 'number') gameInfo.campaignsJoinedAmount = 0;
    if (typeof gameInfo.campaignsCreatedAmount !== 'number') gameInfo.campaignsCreatedAmount = 0;
    if (typeof gameInfo.campaignsClosedAmount !== 'number') gameInfo.campaignsClosedAmount = 0;
    if (typeof gameInfo.equipBoughtAmount !== 'number') gameInfo.equipBoughtAmount = 0;

    return userDetails;
}

export function incrementGameInfoCounter(userDetails: UserDetail, counter: UserGameInfoCounterKey): UserDetail {
    ensureGameInfoCounters(userDetails);

    const gameInfo = userDetails.gameInfo as Record<UserGameInfoCounterKey, number>;
    gameInfo[counter] += 1;

    return userDetails;
}
