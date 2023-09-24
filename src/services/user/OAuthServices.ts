import Discord from 'passport-discord';
import Facebook from 'passport-facebook';
import Google from 'passport-google-oauth20';
import { MongoModel } from '@tablerise/database-management';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import userSerializer, { postUserDetailsSerializer, postUserSerializer } from 'src/support/helpers/userSerializer';
import { Logger } from 'src/types/Logger';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import getErrorName from 'src/support/helpers/getErrorName';

export default class OAuthServices {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger
    ) {}

    public async google(profile: Google.Profile): Promise<any> {
        const externalUserInfo = userSerializer(profile);

        const userSerialized = postUserSerializer(externalUserInfo);
        const userDetailsSerialized = postUserDetailsSerializer({});

        const emailAlreadyExist = await this._model.findAll({ email: userSerialized.email });

        if (emailAlreadyExist.length)
            throw new HttpRequestErrors({
                message: 'Email already exists in database',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });

        userSerialized.createdAt = new Date().toISOString();
        userSerialized.updatedAt = new Date().toISOString();
        userSerialized.password = 'oauth';
        userSerialized.tag = `#${Math.floor(Math.random() * 9999) + 1}`;

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;
        userDetailsSerialized.secretQuestion = { question: 'oauth', answer: 'google' };

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');
        this._logger('info', 'Registration in the database made with Google was successful');

        userRegistered._doc.inProgress = { status: 'wait_to_complete', code: null }

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }

    public async facebook(profile: Facebook.Profile): Promise<any> {
        const externalUserInfo = userSerializer(profile);

        const userSerialized = postUserSerializer(externalUserInfo);
        const userDetailsSerialized = postUserDetailsSerializer({});

        const emailAlreadyExist = await this._model.findAll({ email: userSerialized.email });

        if (emailAlreadyExist.length)
            throw new HttpRequestErrors({
                message: 'Email already exists in database',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });

        userSerialized.createdAt = new Date().toISOString();
        userSerialized.updatedAt = new Date().toISOString();
        userSerialized.password = 'oauth';
        userSerialized.tag = `#${Math.floor(Math.random() * 9999) + 1}`;

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;
        userDetailsSerialized.secretQuestion = { question: 'oauth', answer: 'facebook' };

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');
        this._logger('info', 'Registration in the database made with Facebook was successful');

        userRegistered._doc.inProgress = { status: 'wait_to_complete', code: null }

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }

    public async discord(profile: Discord.Profile): Promise<any> {
        const externalUserInfo = userSerializer(profile);

        const userSerialized = postUserSerializer(externalUserInfo);
        const userDetailsSerialized = postUserDetailsSerializer({});

        const emailAlreadyExist = await this._model.findAll({ email: userSerialized.email });

        if (emailAlreadyExist.length)
            throw new HttpRequestErrors({
                message: 'Email already exists in database',
                code: HttpStatusCode.BAD_REQUEST,
                name: getErrorName(HttpStatusCode.BAD_REQUEST),
            });

        userSerialized.createdAt = new Date().toISOString();
        userSerialized.updatedAt = new Date().toISOString();
        userSerialized.password = 'oauth';
        userSerialized.tag = `#${Math.floor(Math.random() * 9999) + 1}`;

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;
        userDetailsSerialized.secretQuestion = { question: 'oauth', answer: 'discord' };

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');
        this._logger('info', 'Registration in the database made with Discord was successful');

        userRegistered._doc.inProgress = { status: 'wait_to_complete', code: null }

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }
}
