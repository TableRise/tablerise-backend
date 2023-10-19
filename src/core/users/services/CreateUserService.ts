import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { SecurePasswordHandler } from 'src/services/user/helpers/SecurePasswordHandler';
import { postUserSerializer, postUserDetailsSerializer } from 'src/services/user/helpers/userSerializer';
import { FullUser, __UserEnriched, __UserSaved, __UserSerialized } from 'src/services/user/types/Register';
import { RegisterUserPayload } from 'src/types/Response';
import { CreateUserServiceContract } from 'src/types/contracts/users/CreateUser';



export default class CreateUserService extends CreateUserServiceContract {
    constructor({ logger, usersModel, usersDetailsModel, httpRequestErrors, emailSender }: CreateUserServiceContract) {
        super();
        this.usersModel = usersModel;
        this.usersDetailsModel = usersDetailsModel;
        this.httpRequestErrors = httpRequestErrors;
        this.emailSender = emailSender;
        this.logger = logger;
    }

    private async _createTwoFactor({ user, userDetails }: FullUser): Promise<FullUser> {
        this.logger('info', '[CreateTwoFactor - Enrichment - CreateUserService]');
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
        this.logger('info', '[Serialize - CreateUserService]');
        const { details: userDetails, ...userMain } = user;
        const userSerialized = postUserSerializer(userMain);
        const userDetailsSerialized = postUserDetailsSerializer(userDetails);

        const userInDb = await this.usersModel.findAll({ email: userSerialized.email });

        if (userInDb) {
            this.logger('error', 'Email already exists - CreateUserService');
            this.httpRequestErrors.throwError('email-already-exist');
        }

        return { userSerialized, userDetailsSerialized };
    }

    public async enrichment({ user, userDetails }: FullUser): Promise<__UserEnriched> {
        this.logger('info', '[Enrichment - CreateUserService]');
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagInDb = await this.usersModel.findAll({ tag, nickname: user.nickname });

        if (tagInDb) {
            this.logger('error', 'User with this tag already exists - CreateUserService');
            this.httpRequestErrors.throwError('tag-already-exist');
        }

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = {
            status: 'wait_to_confirm',
            code: '',
        };

        if (!user.twoFactorSecret.active && !userDetails.secretQuestion) {
            this.logger('error', 'When 2FA is disabled, secretQuestion must be enable - CreateUserService');
            this.httpRequestErrors.throwError('2fa-and-secret-question-no-active');
        }

        const userWithTwoFactor = user.twoFactorSecret.active
            ? await this._createTwoFactor({ user, userDetails })
            : { user, userDetails };

        return {
            userEnriched: userWithTwoFactor.user,
            userDetailsEnriched: userWithTwoFactor.userDetails
        };
    }

    public async saveUser({ user, userDetails }: FullUser): Promise<__UserSaved> {
        this.logger('info', '[SaveUser - CreateUserService]');
        const userSaved = await this.usersModel.create(user);
        const userDetailsSaved = await this.usersDetailsModel.create(userDetails);

        this.logger('info', 'User saved on database');
        this.logger('info', 'User details saved on database');

        this.emailSender.type = 'confirmation';
        const emailSended = await this.emailSender.send({
            username: userSaved.nickname,
            subject: 'Email de confirmação - TableRise',
        }, userSaved.email);

        if (!emailSended.success) {
            this.logger('error', 'Some error ocurred in email sending - CreateUserService');
            this.httpRequestErrors.throwError('verification-email-send-fail');
        }

        userSaved.inProgress.code = emailSended.verificationCode as string;

        await this.usersModel.update(userSaved._id as string, user);

        return { userSaved, userDetailsSaved };
    }
}
