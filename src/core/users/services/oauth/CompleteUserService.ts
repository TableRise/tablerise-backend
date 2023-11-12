import { CompleteOAuthPayload } from 'src/domains/user/schemas/oAuthValidationSchema';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { CompleteUserServiceContract } from 'src/types/users/contracts/core/CompleteUser';
import { __UserWithID } from 'src/types/users/requests/Payload';
import { RegisterUserResponse, __FullUser } from 'src/types/users/requests/Response';

export default class CompleteUserService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersRepository,
        usersDetailsRepository,
        logger,
    }: CompleteUserServiceContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.process = this.process.bind(this);
        this.save = this.save.bind(this);
    }

    public async process(
        { user, userDetails }: __FullUser,
        payload: CompleteOAuthPayload
    ): Promise<__FullUser> {
        this._logger('info', 'Process - CompleteUserService');
        user.nickname = payload.nickname;

        let nicknameExists;

        try {
            nicknameExists = await this._usersRepository.findOne({
                nickname: user.nickname,
                tag: user.tag,
            });
        } catch (error) {
            if (nicknameExists) HttpRequestErrors.throwError('tag-already-exist');

            user.picture = payload.picture;
            user.inProgress.status = 'done';
            userDetails.firstName = payload.firstName;
            userDetails.lastName = payload.lastName;
            userDetails.pronoun = payload.pronoun;
            userDetails.birthday = payload.birthday;
            userDetails.biography = payload.biography;

            return { user, userDetails };
        }

        HttpRequestErrors.throwError('tag-already-exist');
    }

    public async save({
        userId,
        user,
        userDetails,
    }: __UserWithID): Promise<RegisterUserResponse> {
        this._logger('info', 'Save - CompleteUserService');
        const userUpdated = await this._usersRepository.update({
            query: { userId },
            payload: user,
        });

        const userDetailsUpdated = await this._usersDetailsRepository.update({
            query: { userId },
            payload: userDetails,
        });

        return {
            ...userUpdated,
            details: userDetailsUpdated,
        };
    }
}
