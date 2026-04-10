import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserPayload } from 'src/types/api/users/http/payload';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import { __FullUserPayload, __FullUser } from 'src/types/api/users/methods';

export default class UpdateUserService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['updateUserServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
        this.validateUpdateData = this.validateUpdateData.bind(this);
    }

    private validateUpdateData({ user, userDetails }: __FullUserPayload): void {
        this.logger('info', '_ValidateUpdateData - UpdateUserService');
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
        ];
        const userDetailsForbiddenFields = ['userId', 'userDetailId', 'gameInfo', 'secretQuestion', 'role'];

        const userKeys = Object.keys(user);
        const userDetailsKeys = Object.keys(userDetails);

        userForbiddenFields.forEach((key) => {
            if (userKeys.includes(key))
                throw new HttpRequestErrors({
                    message: `Update User Info - forbidden field: ${key} exists in payload`,
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
        });

        userDetailsForbiddenFields.forEach((key) => {
            if (userDetailsKeys.includes(key))
                throw new HttpRequestErrors({
                    message: `Update User Info - forbidden field: ${key} exists in payload`,
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
        });
    }

    public async update({ userId, payload }: UpdateUserPayload): Promise<__FullUser> {
        this.logger('info', 'Update - UpdateUserService');
        const { details, ...user } = payload;

        this.validateUpdateData({ user, userDetails: details });

        const userInDb = await this.usersRepository.findOne({ userId });
        const userDetailsInDb = await this.usersDetailsRepository.findOne({ userId });

        const newUserToSave = {
            ...userInDb,
            ...user,
        };

        const newUserDetailsToSave = {
            ...userDetailsInDb,
            ...details,
        };

        return {
            user: newUserToSave,
            userDetails: newUserDetailsToSave,
        };
    }

    public async save({ user, userDetails }: __FullUser): Promise<RegisterUserResponse> {
        const newUser = await this.usersRepository.update({
            query: { userId: user.userId },
            payload: user,
        });

        const newUserDetails = await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        this.logger('info', 'User saved on database');
        this.logger('info', 'User details saved on database');

        return {
            ...newUser,
            details: newUserDetails,
        };
    }
}
