import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import getErrorName from 'src/domains/common/helpers/getErrorName';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserDetailsPayload } from 'src/types/api/users/http/payload';

export default class UpdateUserDetailsService {
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['updateUserDetailsServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.update = this.update.bind(this);
        this.validateUpdateData = this.validateUpdateData.bind(this);
    }

    private validateUpdateData(userDetails: UpdateUserDetailsPayload['payload']): void {
        const callName = `[${this.constructor.name}] - ${this.validateUpdateData.name}`;
        this.logger('info', callName);
        const userDetailsForbiddenFields = ['userId', 'userDetailId', 'gameInfo', 'role', 'cover'];
        const userDetailsKeys = Object.keys(userDetails);

        userDetailsForbiddenFields.forEach((key) => {
            if (userDetailsKeys.includes(key))
                throw new HttpRequestErrors({
                    message: `Update User Details Info - forbidden field: ${key} exists in payload`,
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
        });
    }

    public async update({ userId, payload }: UpdateUserDetailsPayload): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);
        this.validateUpdateData(payload);

        const userDetailsInDb = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetailsInDb) HttpRequestErrors.throwError('user-inexistent');
        const newUserDetailsToSave = {
            ...userDetailsInDb,
            ...payload,
        };

        const newUserDetails = await this.usersDetailsRepository.update({
            query: { userDetailId: newUserDetailsToSave.userDetailId },
            payload: newUserDetailsToSave,
        });

        this.logger('info', 'User details saved on database');
        return newUserDetails;
    }
}
