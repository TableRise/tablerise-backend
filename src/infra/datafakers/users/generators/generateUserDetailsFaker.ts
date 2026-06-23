import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserDetailJSONPayload } from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import dataGenerator from '../dataGenerator';
import { DEFAULT_USER_TITLE } from 'src/domains/users/helpers/UserProgression';

function createUserDetailFaker({ userDetailId = newUUID() }: UserDetail): UserDetail {
    return {
        userDetailId,
        userId: newUUID(),
        firstName: dataGenerator.name.first('female'),
        lastName: dataGenerator.name.last('female'),
        birthday: dataGenerator.birthday().toISOString(),
        gender: 'female',
        gameInfo: {
            campaigns: [],
            characters: [],
            badges: [],
            bannedFromCampaigns: [],
            charactersCreatedAmount: 0,
            campaignsJoinedAmount: 0,
            campaignsCreatedAmount: 0,
            campaignsClosedAmount: 0,
            equipBoughtAmount: 0,
            donateAmount: 0,
            playersAdded: 0,
            userRegistered: 0,
            userLevelAmount: 0,
        },
        biography: dataGenerator.biography(),
        title: DEFAULT_USER_TITLE,
        rank: 'bronze',
        xp: 0,
        level: 1,
        cover: {
            request: { success: true, status: 200 },
            id: '',
            title: '',
            link: '',
            uploadDate: new Date().toISOString(),
            deleteUrl: '',
        },
        messages: [],
        gallery: [],
        friends: [],
        social: {
            discord: '',
            instagram: '',
            x: '',
        },
        role: 'admin',
    } as UserDetail;
}

export default function generateUserDetailsFaker({ count, userDetailId }: UserDetailJSONPayload): UserDetail[] {
    const users: UserDetail[] = [];

    for (let index = 0; index <= count; index += 1) {
        users.push(createUserDetailFaker({ userDetailId } as UserDetail));
    }

    return users;
}
