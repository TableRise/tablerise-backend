import { MongoModel } from '@tablerise/database-management';
import { Logger } from 'src/types/Logger';
import { RegisterUserPayload, RegisterUserResponse } from 'src/types/Response';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import { SchemasUserType } from 'src/schemas';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import { postUserDetailsSerializer, postUserSerializer } from 'src/support/helpers/userSerializer';
import ValidateData from 'src/support/helpers/ValidateData';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import getErrorName from 'src/support/helpers/getErrorName';

export default class RegisterServices {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger,
        private readonly _validate: ValidateData,
        private readonly _schema: SchemasUserType
    ) {}

    private _cryptographer(param: any): any {
        return param;
    }

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

        userSerialized.tag = tag;
        userSerialized.createdAt = new Date().toISOString();
        userSerialized.updatedAt = new Date().toISOString();
        userSerialized.password = this._cryptographer(userSerialized.password);

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');

        userRegistered._doc.inProgress = { status: 'wait_to_confirm', code: null }

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }
}
