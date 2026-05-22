import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserPayload } from 'src/types/api/users/http/payload';

export default class UpdateUserService {
    private readonly usersRepository;
    private readonly logger;

    constructor({ usersRepository, logger }: UserCoreDependencies['updateUserServiceContract']) {
        this.usersRepository = usersRepository;
        this.logger = logger;

        this.update = this.update.bind(this);
        this.validateUpdateData = this.validateUpdateData.bind(this);
    }

    private validateUpdateData(user: UpdateUserPayload['payload']): void {
        const callName = `[${this.constructor.name}] - ${this.validateUpdateData.name}`;
        this.logger('info', callName);
        const userForbiddenFields = [
            'userId',
            'email',
            'password',
            'tag',
            'twoFactorSecret',
            'createdAt',
            'updatedAt',
            'inProgress',
            'providerId',
            'picture',
        ];

        const userKeys = Object.keys(user);

        userForbiddenFields.forEach((key) => {
            if (userKeys.includes(key))
                throw new HttpRequestErrors({
                    message: `Update User Info - forbidden field: ${key} exists in payload`,
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
        });
    }

    public async update({ userId, payload }: UpdateUserPayload): Promise<User> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);
        this.validateUpdateData(payload);

        const userInDb = await this.usersRepository.findOne({ userId });

        const newUserToSave = {
            ...userInDb,
            ...payload,
        };

        const newUser = await this.usersRepository.update({
            query: { userId: newUserToSave.userId },
            payload: newUserToSave,
        });

        this.logger('info', 'User saved on database');
        return newUser;
    }
}
