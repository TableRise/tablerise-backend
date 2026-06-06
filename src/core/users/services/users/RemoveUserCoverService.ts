import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { RemoveUserCoverPayload } from 'src/types/api/users/http/payload';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class RemoveUserCoverService {
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['removeUserCoverServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.remove = this.remove.bind(this);
    }

    public async remove({ userId }: RemoveUserCoverPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        if (!userDetails) HttpRequestErrors.throwError('user-inexistent');

        userDetails.cover = null;

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
    }
}
