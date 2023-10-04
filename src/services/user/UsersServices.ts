import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { MongoModel } from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';
import { ConfirmCodeResponse, RegisterUserPayload, RegisterUserResponse } from 'src/types/Response';
import { SchemasUserType } from 'src/schemas';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import { postUserDetailsSerializer, postUserSerializer } from 'src/services/user/helpers/userSerializer';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import getErrorName from 'src/services/helpers/getErrorName';
import generateVerificationCode from 'src/services/user/helpers/generateVerificationCode';
import { SecurePasswordHandler } from 'src/services/user/helpers/SecurePasswordHandler';
import { UserPayload, __UserSerialized } from './types/Register';
import { HttpStatusCode } from '../helpers/HttpStatusCode';
import EmailSender from './helpers/EmailSender';

export default class RegisterServices {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger,
        private readonly _validate: SchemaValidator,
        private readonly _schema: SchemasUserType
    ) {}

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

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }

    public async confirmCode(id: string, code: string): Promise<ConfirmCodeResponse> {
        const userInfo = (await this._model.findOne(id)) as User;

        if (!userInfo) HttpRequestErrors.throwError('user');
        if (typeof code !== 'string') HttpRequestErrors.throwError('query-string');

        if (!userInfo.inProgress || userInfo.inProgress.code !== code)
            throw new HttpRequestErrors({
                message: 'Invalid code',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });

        userInfo.inProgress.status = 'done';

        await this._model.update(id, userInfo);

        return { status: userInfo.inProgress.status };
    }

    public async emailVerify(id: string): Promise<void> {
        const user = await this._model.findOne(id) as User;

        if (!user) HttpRequestErrors.throwError('email');

        if (user.inProgress?.status !== 'done') HttpRequestErrors.throwError('invalid-user-status'); 

        const sendEmail = new EmailSender('verification');
        const verificationCode = await sendEmail.send({ subject: 'Email de verificação - TableRise' }, user.email);

        if (!verificationCode.success) HttpRequestErrors.throwError('verification-email');

        user.inProgress = {
            status: 'wait_to_verify',
            code: verificationCode.verificationCode as string
        };

        user.updatedAt = new Date().toISOString();

        await this._model.update(id, user);
    }

    private async _validateAndSerializeData({ user, userDetails }: UserPayload): Promise<__UserSerialized> {
        this._validate.entry(this._schema.userZod, user);
        this._validate.entry(this._schema.userDetailZod, userDetails);

        const userSerialized = postUserSerializer(user);
        const userDetailsSerialized = postUserDetailsSerializer(userDetails);

        const emailAlreadyExist = await this._model.findAll({ email: userSerialized.email });
        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email');

        return { userSerialized, userDetailsSerialized };
    }

    private async _enrichUser({ user, userDetails }: UserPayload): Promise<__UserSerialized> {
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagAlreadyExist = await this._model.findAll({ tag, nickname: user.nickname });

        if (tagAlreadyExist.length) HttpRequestErrors.throwError('tag');

        const verificationCode = generateVerificationCode(6);

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = {
            status: 'wait_to_confirm',
            code: verificationCode,
        };

        if (user.twoFactorSecret?.active) {
            const secret = speakeasy.generateSecret();
            const url = speakeasy.otpauthURL({
                secret: secret.base32,
                label: `TableRise 2FA (${user.email})`,
                issuer: 'TableRise',
                encoding: 'base32',
            });

            userDetails.secretQuestion = null;
            user.twoFactorSecret = { code: secret.base32, qrcode: url };
            user.twoFactorSecret.qrcode = await qrcode.toDataURL(user.twoFactorSecret.qrcode as string);
            delete user.twoFactorSecret.active;
        }

        return { userSerialized: user, userDetailsSerialized: userDetails };
    }
}
