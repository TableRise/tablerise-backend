import { CompleteOAuthPayload } from 'src/domains/users/schemas/oAuthValidationSchema';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import OAuthCoreDependencies from 'src/types/modules/core/users/OAuthCoreDependencies';
import { __UserWithID, __FullUser } from 'src/types/api/users/methods';
import { RegisterUserResponse } from 'src/types/api/users/http/response';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import { ensureGameInfoCounters } from 'src/domains/users/helpers/GameInfoCounters';

export default class CompleteUserService {
    private readonly usersRepository;
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: OAuthCoreDependencies['completeUserServiceContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.process = this.process.bind(this);
        this.save = this.save.bind(this);
    }

    public async process({ user, userDetails }: __FullUser, payload: CompleteOAuthPayload): Promise<__FullUser> {
        const callName = `[${this.constructor.name}] - ${this.process.name}`;
        this.logger('info', callName);
        user.nickname = payload.nickname;

        const nicknameExists = await this.usersRepository.find({
            nickname: user.nickname,
            tag: user.tag,
        });

        if (nicknameExists.length) HttpRequestErrors.throwError('tag-already-exist');

        user.inProgress.status = InProgressStatusEnum.enum.DONE;
        userDetails.firstName = payload.firstName;
        userDetails.lastName = payload.lastName;
        userDetails.birthday = payload.birthday;
        ensureGameInfoCounters(userDetails);

        return { user, userDetails };
    }

    public async save({ userId, user, userDetails }: __UserWithID): Promise<RegisterUserResponse> {
        const callName = `[${this.constructor.name}] - ${this.save.name}`;
        this.logger('info', callName);
        const userUpdated = await this.usersRepository.update({
            query: { userId },
            payload: user,
        });

        const userDetailsUpdated = await this.usersDetailsRepository.update({
            query: { userId },
            payload: userDetails,
        });

        return {
            ...userUpdated,
            details: userDetailsUpdated,
        };
    }
}
