import speakeasy from 'speakeasy';
import qrcode from 'qrcode';
import { MongoModel } from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';
import { ConfirmCodeResponse, RegisterUserPayload, RegisterUserResponse } from 'src/types/Response';
import { SchemasUserType } from 'src/schemas';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import { postUserDetailsSerializer, postUserSerializer, putUserDetailsSerializer, putUserSerializer } from 'src/services/user/helpers/userSerializer';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import getErrorName from 'src/services/helpers/getErrorName';
import { SecurePasswordHandler } from 'src/services/user/helpers/SecurePasswordHandler';
import { UserPayload, __UserSaved, __UserSerialized } from './types/Register';
import { HttpStatusCode } from '../helpers/HttpStatusCode';
import EmailSender from './helpers/EmailSender';
import { formatDbQuery } from './helpers/formatDbQuery';

export default class RegisterServices {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger,
        private readonly _validate: SchemaValidator,
        private readonly _schema: SchemasUserType
    ) {}

    private async _serializeData({ user, userDetails }: UserPayload): Promise<__UserSerialized> {
        this._validate.entry(this._schema.userZod, user);
        this._validate.entry(this._schema.userDetailZod, userDetails);

        const userSerialized = postUserSerializer(user);
        const userDetailsSerialized = postUserDetailsSerializer(userDetails);

        return { userSerialized, userDetailsSerialized };
    }

    private async _enrichUser({ user, userDetails }: UserPayload): Promise<__UserSerialized> {
        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagAlreadyExist = await this._model.findAll({ tag, nickname: user.nickname });

        if (tagAlreadyExist.length) HttpRequestErrors.throwError('tag');

        user.tag = tag;
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = {
            status: 'wait_to_confirm',
            code: '',
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
                subject: 'TableRise - Precisamos confirmar seu email',
            },
            user.email
        );

        if (!confirmEmail.success) HttpRequestErrors.throwError('verification-email');

        // @ts-expect-error inProgress will exist below
        user.inProgress.code = confirmEmail.verificationCode as string;

        await this._model.update(user._id as string, user);
    }

    public async register(payload: RegisterUserPayload): Promise<RegisterUserResponse> {
        const { details: userDetails, ...user } = payload;

        const userPreSerialized = await this._serializeData({
            user,
            userDetails,
        });

        const emailAlreadyExist = await this._model.findAll({ email: user.email });
        if (emailAlreadyExist.length) HttpRequestErrors.throwError('email');

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
        const user = (await this._model.findOne(id)) as User;

        if (!user) HttpRequestErrors.throwError('user');

        // @ts-expect-error In progress will exist below
        if (user.inProgress.status !== 'done') HttpRequestErrors.throwError('invalid-user-status');

        const sendEmail = new EmailSender('verification');
        const verificationCode = await sendEmail.send({ subject: 'Email de verificação - TableRise' }, user.email);

        if (!verificationCode.success) HttpRequestErrors.throwError('verification-email');

        user.inProgress = {
            status: 'wait_to_verify',
            code: verificationCode.verificationCode as string,
        };

        user.updatedAt = new Date().toISOString();

        await this._model.update(id, user);
    }

    public async delete(id: string): Promise<void> {
        const [userDetailsInfo] = await this._modelDetails.findAll({ userId: id });

        if (!userDetailsInfo) HttpRequestErrors.throwError('user');
        if (userDetailsInfo.gameInfo.campaigns.length || userDetailsInfo.gameInfo.characters.length) {
            HttpRequestErrors.throwError('linked-data');
        }

        await this._model.delete(id);
        this._logger('info', 'User deleted from database');
    }

    public async update(id: string, payload: RegisterUserPayload): Promise<any> {
        this._logger('info', 'prepare to update user info');

        const { details: userDetails, ...userPayload } = payload;

        Object.keys(userPayload).forEach((field) => {
            const forbiddenField = ['email', 'password', 'tag', 'createdAt', 'updatedAt', 'inProgress', 'providerId'];
            if (forbiddenField.includes(field)) {
                throw new HttpRequestErrors({
                    message: `Update User Info - ${field} is a forbidden field  and cannot be updated through this request`,
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
            }
        });

        Object.keys(userDetails).forEach((field) => {
            const forbiddenField  = ['userId', 'gameInfo', 'secretQuestion', 'role'];            
            if (forbiddenField.includes(field)) {
                throw new HttpRequestErrors({
                    message: `Update UserDetails Info - ${field} is a forbidden field  and cannot be updated through this request`,
                    code: HttpStatusCode.FORBIDDEN,
                    name: getErrorName(HttpStatusCode.FORBIDDEN),
                });
            }
        });

        const userInfo = (await this._model.findOne(id)) as User;
        if (!userInfo) HttpRequestErrors.throwError('user');

        const [userDetailsInfo] = await this._modelDetails.findAll({ userId: id });
        if (!userDetailsInfo) HttpRequestErrors.throwError('user');
        console.log('L221', userDetailsInfo);
        const userSerialized = putUserSerializer(userPayload, userInfo);
        const userDetailsSerialized = putUserDetailsSerializer(userDetails, userDetailsInfo);

        userSerialized.createdAt = new Date().toISOString();
        console.log('userSerialized \n', userSerialized, '\n Keys:',Object.keys(userSerialized));
        console.log('userDetails:\n', userDetailsSerialized, '\n Keys:',Object.keys(userDetailsSerialized));

        const userUpdated = formatDbQuery(await this._model.update(id, userSerialized)) as User;
        this._logger('info', 'User updated at database');

        const userDetailsUpdated = await this._modelDetails.update(userDetailsInfo._id as string , userDetailsSerialized) as UserDetail;
        this._logger('info', 'UserDetails updated at database');
        console.log('228',{ ...userUpdated, details: userDetailsUpdated});
        return { ...userUpdated, details: userDetailsUpdated};
    }
}
