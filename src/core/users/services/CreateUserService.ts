import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { __FullUser, __UserEnriched, __UserSaved, __UserSerialized } from 'src/types/requests/Response';
import { RegisterUserPayload } from 'src/types/requests/Payload';
import { CreateUserServiceContract } from 'src/types/contracts/users/CreateUser';
import SecurePasswordHandler from 'src/infra/helpers/user/SecurePasswordHandler';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import newUUID from 'src/infra/helpers/user/newUUID';

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

        this._createTwoFactor = this._createTwoFactor.bind(this);
        this.enrichment = this.enrichment.bind(this);
        this.saveUser = this.saveUser.bind(this);
        this.serialize = this.serialize.bind(this);
    }

    private async _createTwoFactor({ user, userDetails }: __FullUser): Promise<__FullUser> {
        this._logger('info', 'CreateTwoFactor - Enrichment - CreateUserService');
        const secret = speakeasy.generateSecret();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `TableRise 2FA (${user.email})`,
            issuer: 'TableRise',
            encoding: 'base32',
        });

        userDetails.secretQuestion = null;
        user.twoFactorSecret = { secret: secret.base32, qrcode: url, active: true };
        user.twoFactorSecret.qrcode = await qrcode.toDataURL(user.twoFactorSecret.qrcode as string);

        return { user, userDetails };
    }

    public async serialize(user: RegisterUserPayload): Promise<__UserSerialized> {
        this._logger('info', 'Serialize - CreateUserService');
        const { details: userDetails, ...userMain } = user;
        const userSerialized = this._serializer.postUser(userMain);
        const userDetailsSerialized = this._serializer.postUserDetails(userDetails);

        const userInDb = await this._usersRepository.find({ email: userSerialized.email });

        if (userInDb.length) {
            this._logger('error', 'Email already exists - CreateUserService');
            HttpRequestErrors.throwError('email-already-exist');
        }

        return { userSerialized, userDetailsSerialized };
    }

    public async enrichment({ user, userDetails }: __FullUser): Promise<__UserEnriched> {
        this._logger('info', 'Enrichment - CreateUserService');
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagInDb = await this._usersRepository.find({ tag, nickname: user.nickname });

        if (tagInDb.length) {
            this._logger('error', 'User with this tag already exists - CreateUserService');
            HttpRequestErrors.throwError('tag-already-exist');
        }

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = {
            status: 'wait_to_confirm',
            code: '',
        };

        if (!user.twoFactorSecret.active && !userDetails.secretQuestion)
            HttpRequestErrors.throwError('2fa-and-secret-question-no-active');

        const userWithTwoFactor = user.twoFactorSecret.active
            ? await this._createTwoFactor({ user, userDetails })
            : { user, userDetails };

        return {
            userEnriched: userWithTwoFactor.user,
            userDetailsEnriched: userWithTwoFactor.userDetails,
        };
    }

    public async saveUser({ user, userDetails }: __FullUser): Promise<__UserSaved> {
        this._logger('info', 'SaveUser - CreateUserService');
        const userSaved = await this._usersRepository.create({
            ...user,
            userId: newUUID(),
        });

        const userDetailsSaved = await this._usersDetailsRepository.create({
            ...userDetails,
            userId: userSaved.userId,
            userDetailId: newUUID(),
        });

        this._logger('info', 'User saved on database');
        this._logger('info', 'User details saved on database');

        this._emailSender.type = 'confirmation';
        const emailSended = await this._emailSender.send(
            {
                username: userSaved.nickname,
                subject: 'Email de confirmação - TableRise',
            },
            userSaved.email
        );

        if (!emailSended.success) HttpRequestErrors.throwError('verification-email-send-fail');

        userSaved.inProgress.code = emailSended.verificationCode as string;

        await this._usersRepository.update({ id: userSaved.userId, payload: userSaved });

        return { userSaved, userDetailsSaved };
    }
}
