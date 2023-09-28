import { MongoModel } from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';
import { RegisterUserPayload, RegisterUserResponse, ConfirmCodeResponse } from 'src/types/Response';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { SchemasUserType } from 'src/schemas';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import { postUserDetailsSerializer, postUserSerializer } from 'src/support/helpers/userSerializer';
import ValidateData from 'src/support/helpers/ValidateData';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import getErrorName from 'src/support/helpers/getErrorName';
import EmailSender from 'src/support/helpers/EmailSender';
import generateVerificationCode from 'src/support/helpers/generateVerificationCode';
import { SecurePasswordHandler } from 'src/support/helpers/SecurePasswordHandler';

export default class RegisterServices {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasUserType
    ) {}

    public async register(payload: RegisterUserPayload): Promise<RegisterUserResponse> {
        const { details: userDetails, ...user } = payload;
        this._validate.entry(this._schema.userZod, user);
        this._validate.entry(this._schema.userDetailZod, userDetails);

        const userSerialized = postUserSerializer(payload);
        const userDetailsSerialized = postUserDetailsSerializer(payload.details);

        const emailAlreadyExist = await this._model.findAll({ email: userSerialized.email });

        if (emailAlreadyExist.length)
            throw new HttpRequestErrors({
                message: 'Email already exists in database',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });

        const tag = `#${Math.floor(Math.random() * 9999) + 1}`;
        const tagAlreadyExist = await this._model.findAll({ tag, nickname: userSerialized.nickname });

        if (tagAlreadyExist.length)
            throw new HttpRequestErrors({
                message: 'User already exists in database',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });

        const verificationCode = generateVerificationCode(6);

        userSerialized.tag = tag;
        userSerialized.createdAt = new Date().toISOString();
        userSerialized.updatedAt = new Date().toISOString();
        userSerialized.password = this._cryptographer(userSerialized.password);
        userSerialized.inProgress = {
            status: 'wait_to_confirm',
            code: verificationCode,
        };
        userSerialized.password = await SecurePasswordHandler.hashPassword(userSerialized.password);

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');

        const emailSender = new EmailSender();
        const content = {
            username: userRegistered.nickname,
            subject: 'Tablerise confirmation code',
            body: '',
        };
        await emailSender.send('confirmation', content, userRegistered.email);

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }

    private _cryptographer(password: string): string {
        return password;
    }

    public async confirmCode(id: string, code: string): Promise<ConfirmCodeResponse> {
        const userInfo = await this._model.findOne(id);

        if (!userInfo)
            throw new HttpRequestErrors({
                message: 'User not found in database',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        if (userInfo.inProgress?.code !== code)
            throw new HttpRequestErrors({
                message: 'Invalid code',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });

        userInfo.inProgress.status = 'done';

        const userUpdated = await this._model.update(id, userInfo);

        if (!userUpdated?.inProgress)
            throw new HttpRequestErrors({
                message: 'User not found in database',
                code: HttpStatusCode.NOT_FOUND,
                name: getErrorName(HttpStatusCode.NOT_FOUND),
            });

        return {
            status: userUpdated?.inProgress?.status,
        };
    }
}
