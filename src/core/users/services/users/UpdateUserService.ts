import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import getErrorName from 'src/infra/helpers/common/getErrorName';
import { UpdateUserServiceContract } from 'src/types/contracts/users/UpdateUser';
import { UpdateUserPayload, __FullUserPayload } from 'src/types/requests/Payload';
import { RegisterUserResponse, __FullUser } from 'src/types/requests/Response';

export default class UpdateUserService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: UpdateUserServiceContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.update = this.update.bind(this);
        this.save = this.save.bind(this);
        this._validateUpdateData = this._validateUpdateData.bind(this);
    }

    private _validateUpdateData({ user, userDetails }: __FullUserPayload): void {
        this._logger('info', '_ValidateUpdateData - UpdateUserService');
        const userForbiddenFields = [
            'email',
            'password',
            'tag',
            'twoFactorSecret',
            'createdAt',
            'updatedAt',
            'inProgress',
            'providerId',
        ];
        const userDetailsForbiddenFields = [
            'userId',
            'gameInfo',
            'secretQuestion',
            'role',
        ];

        userForbiddenFields.forEach((key) => {
            if (Object.keys(user).includes(key))
                throw new HttpRequestErrors({
                    message: `Update User Info - forbidden field: ${key} exists in payload`,
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
        });

        userDetailsForbiddenFields.forEach((key) => {
            if (Object.keys(userDetails).includes(key))
                throw new HttpRequestErrors({
                    message: `Update User Info - forbidden field: ${key} exists in payload`,
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
        });
    }

    public async update({ userId, payload }: UpdateUserPayload): Promise<__FullUser> {
        this._logger('info', 'Update - UpdateUserService');
        const { details, ...user } = payload;

        this._validateUpdateData({ user, userDetails: details });

        const userInDb = await this._usersRepository.findOne(userId);
        const [userDetailsInDb] = await this._usersDetailsRepository.find({ userId });

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
        const newUser = await this._usersRepository.update({
            id: user.userId,
            payload: user,
        });
        const newUserDetails = await this._usersDetailsRepository.update({
            id: userDetails.userDetailId,
            payload: userDetails,
        });

        this._logger('info', 'User saved on database');
        this._logger('info', 'User details saved on database');

        return {
            ...newUser,
            details: newUserDetails,
        };
    }
}
