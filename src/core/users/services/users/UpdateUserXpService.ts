import { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateUserXpPayload } from 'src/types/api/users/http/payload';
import {
    addBadgeIfMissing,
    addXp,
    finalizeProgression,
    getManualXpBadge,
    snapshotProgression,
} from 'src/domains/users/helpers/UserProgression';

export default class UpdateUserXpService {
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['updateUserXpServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.update = this.update.bind(this);
    }

    public async update({ userId, xp }: UpdateUserXpPayload): Promise<UserDetail> {
        const callName = `[${this.constructor.name}] - ${this.update.name}`;
        this.logger('info', callName);

        const userDetails = await this.usersDetailsRepository.findOne({ userId });
        const progressionSnapshot = snapshotProgression(userDetails);

        addXp(userDetails, xp);

        const badgeToAward = getManualXpBadge(xp);
        if (badgeToAward) {
            addBadgeIfMissing(userDetails, badgeToAward);
        }

        finalizeProgression(userDetails, progressionSnapshot);

        return this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });
    }
}
