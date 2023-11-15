import {
    __FullUser,
    __UserEnriched,
    __UserSaved,
    __UserSerialized,
} from 'src/types/users/requests/Response';
import { RegisterUserPayload } from 'src/types/users/requests/Payload';
import { CreateUserServiceContract } from 'src/types/users/contracts/core/CreateUser';
import SecurePasswordHandler from 'src/infra/helpers/user/SecurePasswordHandler';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';

export default class CreateUserService {
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;
    private readonly _emailSender;
    private readonly _serializer;
    private readonly _logger;

    constructor({
        usersDetailsRepository,
        usersRepository,
        logger,
        emailSender,
        serializer,
    }: CreateUserServiceContract) {
        this._usersRepository = usersRepository;
        this._usersDetailsRepository = usersDetailsRepository;
        this._emailSender = emailSender;
        this._serializer = serializer;
        this._logger = logger;

        this.enrichment = this.enrichment.bind(this);
        this.save = this.save.bind(this);
        this.serialize = this.serialize.bind(this);
    }

    public async serialize(user: RegisterUserPayload): Promise<__UserSerialized> {
        this._logger('info', 'Serialize - CreateUserService');
        const { details: userDetails, ...userMain } = user;
        const userSerialized = this._serializer.postUser(userMain);
        const userDetailsSerialized = this._serializer.postUserDetails(userDetails);

        const userInDb = await this._usersRepository.find({
            email: userSerialized.email,
        });

        if (userInDb.length) {
            this._logger('error', 'Email already exists - CreateUserService');
            HttpRequestErrors.throwError('email-already-exist');
        }

        return { userSerialized, userDetailsSerialized };
    }

    public async enrichment({ user, userDetails }: __FullUser): Promise<__UserEnriched> {
        this._logger('info', 'Enrichment - CreateUserService');
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagInDb = await this._usersRepository.find({
            tag,
            nickname: user.nickname,
        });

        if (tagInDb.length) {
            this._logger(
                'error',
                'User with this tag already exists - CreateUserService'
            );
            HttpRequestErrors.throwError('tag-already-exist');
        }

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = { status: 'wait_to_confirm', code: '' };

        if (!user.twoFactorSecret.active && !userDetails.secretQuestion)
            HttpRequestErrors.throwError('2fa-and-secret-question-no-active');

        return {
            userEnriched: user,
            userDetailsEnriched: userDetails,
        };
    }

    public async save({ user, userDetails }: __FullUser): Promise<__UserSaved> {
        this._logger('info', 'Save - CreateUserService');

        const userSaved = await this._usersRepository.create({
            ...user,
        });

        const userDetailsSaved = await this._usersDetailsRepository.create({
            ...userDetails,
            userId: userSaved.userId,
        });

        this._emailSender.type = 'confirmation';
        const emailSended = await this._emailSender.send(
            {
                username: userSaved.nickname,
                subject: 'Email de confirmação - TableRise',
            },
            userSaved.email
        );

        if (!emailSended.success)
            HttpRequestErrors.throwError('verification-email-send-fail');

        userSaved.inProgress.code = emailSended.verificationCode as string;

        await this._usersRepository.update({
            query: { userId: userSaved.userId },
            payload: userSaved,
        });

        return { userSaved, userDetailsSaved };
    }
}
