import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserDetailJSONPayload } from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import dataGenerator from '../dataGenerator';

function createUserDetailFaker({ userDetailId = newUUID() }: UserDetail): UserDetail {
    return {
        userDetailId,
        userId: newUUID(),
        firstName: dataGenerator.name.first('female'),
        lastName: dataGenerator.name.last('female'),
        birthday: dataGenerator.birthday().toISOString(),
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
        },
        biography: dataGenerator.biography(),
        rank: '',
        cover: {
            request: { success: true, status: 200 },
            id: '',
            title: '',
            link: '',
            uploadDate: new Date().toISOString(),
            deleteUrl: '',
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
