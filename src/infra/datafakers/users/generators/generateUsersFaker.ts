import User from '@tablerise/database-management/dist/src/interfaces/User';
import newUUID from 'src/domains/common/helpers/newUUID';
import { UserJSONPayload } from 'src/types/modules/infra/datafakers/users/DomainDataFaker';
import dataGenerator from '../dataGenerator';
import DomainDataFaker from '../../campaigns/DomainDataFaker';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';

function createUserFaker({ userId = newUUID() }: User): User {
    return {
        userId,
        inProgress: {
            status: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
            currentFlow: stateFlowsEnum.enum.CREATE_USER,
            prevStatusWas: InProgressStatusEnum.enum.WAIT_TO_CONFIRM,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: 'HJS74',
        },
        providerId: '',
        email: dataGenerator.email(),
        password: 'TheWorld@122',
        nickname: dataGenerator.nickname(),
        tag: `#${dataGenerator.number({ min: 1000, max: 9999 })}`,
        picture: DomainDataFaker.generateImagesObjectJSON()[0],
        twoFactorSecret: { active: false },
    } as User;
}

export default function generateUsersFaker({ count, userId }: UserJSONPayload): User[] {
    const users: User[] = [];

    for (let index = 0; index <= count; index += 1) {
        users.push(createUserFaker({ userId } as User));
    }

    return users;
}
