import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { MongoModel } from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';
import {
    ConfirmCodeResponse,
    RegisterUserPayload,
    RegisterUserResponse,
    TwoFactorSecret,
    emailUpdatePayload,
} from 'src/types/Response';
import { SchemasUserType } from 'src/schemas';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User, UserTwoFactor, emailUpdateZodSchema } from 'src/schemas/user/usersValidationSchema';
import { postUserDetailsSerializer, postUserSerializer } from 'src/services/user/helpers/userSerializer';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { SecurePasswordHandler } from 'src/services/user/helpers/SecurePasswordHandler';
import { UserPayload, __UserSaved, __UserSerialized } from './types/Register';
import EmailSender from './helpers/EmailSender';
import { GameInfoOptions } from 'src/types/GameInfo';
import { HttpStatusCode } from '../helpers/HttpStatusCode';
import getErrorName from '../helpers/getErrorName';

export default class RegisterServices {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger,
        private readonly _validate: SchemaValidator,
        private readonly _schema: SchemasUserType
    ) {}

    private async _validateAndSerializeData({ user, userDetails }: UserPayload): Promise<__UserSerialized> {
        this._validate.entry(this._schema.userZod, user);
        this._validate.entry(this._schema.userDetailZod, userDetails);

        const userSerialized = postUserSerializer(user);
        const userDetailsSerialized = postUserDetailsSerializer(userDetails);

        const emailAlreadyExist = await this._model.findAll({ email: userSerialized.email });
        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email-already-exist');

        return { userSerialized, userDetailsSerialized };
    }

    private async _enrichUser({ user, userDetails }: UserPayload): Promise<__UserSerialized> {
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagAlreadyExist = await this._model.findAll({ tag, nickname: user.nickname });

        if (tagAlreadyExist.length) HttpRequestErrors.throwError('tag-already-exist');

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = {
            status: 'wait_to_confirm',
            code: '',
        };

        if (user.twoFactorSecret.active) {
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
        }

        return { userSerialized: user, userDetailsSerialized: userDetails };
    }

    private async _saveUser({ user, userDetails }: UserPayload): Promise<__UserSaved> {
        const userRegister = (await this._model.create(user)) as User & { _doc: User };
        const { _doc: userDoc } = userRegister;

        userDetails.userId = userDoc._id;
        const userDetailsRegister = await this._modelDetails.create(userDetails);

        this._logger('info', 'User saved on database');
        this._logger('info', 'User details saved on database');

        return { userSaved: userDoc, userDetailsSaved: userDetailsRegister };
    }

    private async _emailSendToConfirmUser(user: User): Promise<void> {
        const confirmEmail = await new EmailSender('confirmation').send(
            {
                username: user.nickname,
                subject: 'Email de confirmação - TableRise',
            },
            user.email
        );

        if (!confirmEmail.success) HttpRequestErrors.throwError('verification-email-send-fail');

        // @ts-expect-error inProgress will exist below
        user.inProgress.code = confirmEmail.verificationCode as string;

        await this._model.update(user._id as string, user);
    }

    public async register(payload: RegisterUserPayload): Promise<RegisterUserResponse> {
        const { details: userDetails, ...user } = payload;

        const userPreSerialized = await this._validateAndSerializeData({
            user,
            userDetails,
        });

        const { userSerialized, userDetailsSerialized } = await this._enrichUser({
            user: userPreSerialized.userSerialized,
            userDetails: userPreSerialized.userDetailsSerialized,
        });

        const { userSaved, userDetailsSaved } = await this._saveUser({
            user: userSerialized,
            userDetails: userDetailsSerialized,
        });

        await this._emailSendToConfirmUser(userSaved);

        // @ts-expect-error inProgress will exist below
        return { ...userSaved, details: userDetailsSaved };
    }

    public async confirmCode(id: string, code: string): Promise<ConfirmCodeResponse> {
        const userInfo = (await this._model.findOne(id)) as User;

        if (!userInfo) HttpRequestErrors.throwError('user-inexistent');
        if (typeof code !== 'string') HttpRequestErrors.throwError('query-string-incorrect');

        if (!userInfo.inProgress || userInfo.inProgress.code !== code) {
            HttpRequestErrors.throwError('invalid-email-verify-code');
        }

        userInfo.inProgress.status = 'done';

        await this._model.update(id, userInfo);

        return { status: userInfo.inProgress.status };
    }

    public async emailVerify(id: string): Promise<void> {
        const user = (await this._model.findOne(id)) as User;

        if (!user) HttpRequestErrors.throwError('user-inexistent');

        // @ts-expect-error In progress will exist below
        if (user.inProgress.status !== 'done') HttpRequestErrors.throwError('invalid-user-status');

        const sendEmail = new EmailSender('verification');
        const verificationCode = await sendEmail.send(
            {
                subject: 'Email de verificação - TableRise',
                username: user.nickname,
            },
            user.email
        );

        if (!verificationCode.success) HttpRequestErrors.throwError('verification-email-send-fail');

        user.inProgress = {
            status: 'wait_to_verify',
            code: verificationCode.verificationCode as string,
        };

        user.updatedAt = new Date().toISOString();

        await this._model.update(id, user);
    }

    public async activateTwoFactor(id: string): Promise<UserTwoFactor> {
        const user = (await this._model.findOne(id)) as User;
        if (!user) HttpRequestErrors.throwError('user-inexistent');
        if (user.twoFactorSecret.active) HttpRequestErrors.throwError('2fa-already-active');

        const userDetail = await this._modelDetails.findAll({ userId: user._id });
        if (!userDetail.length) HttpRequestErrors.throwError('user-inexistent');

        const secret = speakeasy.generateSecret();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `TableRise 2FA (${user.email})`,
            issuer: 'TableRise',
            encoding: 'base32',
        });

        user.twoFactorSecret = {
            secret: secret.base32,
            qrcode: await qrcode.toDataURL(url),
            active: true,
        };

        userDetail[0].secretQuestion = null;

        await this._model.update(id, user);
        await this._modelDetails.update(userDetail[0]._id as string, userDetail[0]);

        this._logger('info', `Two Factor Authorization added to user ${user._id as string}`);

        return { qrcode: user.twoFactorSecret.qrcode, active: user.twoFactorSecret.active };
    }

    public async updateEmail(id: string, code: string, payload: emailUpdatePayload): Promise<void> {
        this._validate.entry(emailUpdateZodSchema, payload);
        const { email } = payload;
        const userInfo = (await this._model.findOne(id)) as User;

        if (!userInfo) HttpRequestErrors.throwError('user-inexistent');
        if (typeof code !== 'string') HttpRequestErrors.throwError('query-string-incorrect');

        if (!userInfo.inProgress || userInfo.inProgress.code !== code) {
            HttpRequestErrors.throwError('invalid-email-verify-code');
        }

        const emailAlreadyExist = await this._model.findAll({ email });
        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email-already-exist');

        userInfo.email = email;
        userInfo.inProgress.status = 'email_change';
        userInfo.updatedAt = new Date().toISOString();

        await this._model.update(id, userInfo);
        this._logger('info', 'User email updated');
    }

    public async delete(id: string): Promise<void> {
        const [userDetailsInfo] = await this._modelDetails.findAll({ userId: id });

        if (!userDetailsInfo) HttpRequestErrors.throwError('user-inexistent');
        if (userDetailsInfo.gameInfo.campaigns.length || userDetailsInfo.gameInfo.characters.length) {
            HttpRequestErrors.throwError('linked-mandatory-data-when-delete');
        }

        await this._model.delete(id);
        this._logger('info', 'User deleted from database');
    }

    private isGameInfo(keyInput: string): keyInput is GameInfoOptions {
        return ['badges', 'campaigns', 'characters'].includes(keyInput);
    }

    public async updateGameInfo(idUser: string, dataId: string, gameInfo: string, operation: string): Promise<void> {
        const [userDetailsInfo] = await this._modelDetails.findAll({ userId: idUser });

        if (!this.isGameInfo(gameInfo))
            throw new HttpRequestErrors({
                message: 'Selected game info is invalid',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });

        if (!userDetailsInfo) HttpRequestErrors.throwError('user-inexistent');

        if (operation === 'remove')
            userDetailsInfo.gameInfo[gameInfo] = userDetailsInfo.gameInfo[gameInfo].filter((data) => data !== dataId);

        if (operation === 'add') {
            const hasInfo = userDetailsInfo.gameInfo[gameInfo].filter((data) => data === dataId).length > 0;
            if (!hasInfo) userDetailsInfo.gameInfo[gameInfo].push(dataId);
        }

        await this._modelDetails.update(userDetailsInfo._id as string, userDetailsInfo);
    }

    public async resetTwoFactor(id: string, code: string): Promise<TwoFactorSecret> {
        const userInfo = (await this._model.findOne(id)) as User;

        if (!userInfo) HttpRequestErrors.throwError('user-inexistent');

        if (!userInfo.twoFactorSecret.active) HttpRequestErrors.throwError('2fa-no-active');

        if (!userInfo.inProgress || userInfo.inProgress.code !== code) {
            HttpRequestErrors.throwError('invalid-email-verify-code');
        }

        const secret = speakeasy.generateSecret();
        const url = speakeasy.otpauthURL({
            secret: secret.base32,
            label: `TableRise 2FA (${userInfo.email})`,
            issuer: 'TableRise',
            encoding: 'base32',
        });

        userInfo.inProgress.status = 'done';
        userInfo.twoFactorSecret = {
            secret: secret.base32,
            qrcode: await qrcode.toDataURL(url),
            active: true,
        };

        await this._model.update(id, userInfo);

        return {
            qrcode: userInfo.twoFactorSecret.qrcode,
            active: userInfo.twoFactorSecret.active,
        };
    }
}
