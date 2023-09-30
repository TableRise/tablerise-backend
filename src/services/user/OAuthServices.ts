import speakeasy from 'speakeasy';
import Discord from 'passport-discord';
import Facebook from 'passport-facebook';
import Google from 'passport-google-oauth20';
import { MongoModel } from '@tablerise/database-management';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import userExternalSerializer, {
    postUserDetailsSerializer,
    postUserSerializer,
} from 'src/services/user/helpers/userSerializer';
import { Logger } from 'src/types/Logger';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';
import { RegisterUserResponse } from 'src/types/Response';
import JWTGenerator from 'src/services/authentication/helpers/JWTGenerator';
import { UserPayload, __UserSerialized } from './types/Register';

export default class OAuthServices {
    constructor(
        private readonly _model: MongoModel<User>,
        private readonly _modelDetails: MongoModel<UserDetail>,
        private readonly _logger: Logger
    ) {}

    private _login(userFromDb: User[], userSerialized: User): string {
        const isProviderIdValid = userFromDb[0].providerId === userSerialized.providerId;

        if (!isProviderIdValid) HttpRequestErrors.throwError('email');

        this._logger('info', 'User logged in');
        return JWTGenerator.generate(userFromDb[0]);
    }

    private async _validateAndSerializeData({ user, userDetails }: UserPayload): Promise<__UserSerialized | string> {
        const userSerialized = postUserSerializer(user);
        const userDetailsSerialized = postUserDetailsSerializer({});

        const userAlreadyExist = await this._model.findAll({ email: userSerialized.email });

        if (userAlreadyExist.length) return this._login(userAlreadyExist, userSerialized);

        return { userSerialized, userDetailsSerialized };
    }

    private async _enrichUser({ user, userDetails }: UserPayload, provider: string): Promise<__UserSerialized> {
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();
        user.password = 'oauth';
        user.tag = `#${Math.floor(Math.random() * 9999) + 1}`;

        userDetails.secretQuestion = { question: 'oauth', answer: provider };

        return { userSerialized: user, userDetailsSerialized: userDetails };
    }

    public async google(profile: Google.Profile): Promise<RegisterUserResponse | string> {
        const externalUserInfo = userExternalSerializer(profile);

        const userPreSerialized = await this._validateAndSerializeData({
            user: externalUserInfo as unknown as User,
            userDetails: {} as UserDetail,
        });

        if (typeof userPreSerialized === 'string') return userPreSerialized;

        const { userSerialized, userDetailsSerialized } = await this._enrichUser(
            {
                user: userPreSerialized.userSerialized,
                userDetails: userPreSerialized.userDetailsSerialized,
            },
            'google'
        );

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');
        this._logger('info', 'Registration in the database made with Google was successful');

        userRegistered._doc.inProgress = { status: 'wait_to_complete', code: null };

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }

    public async facebook(profile: Facebook.Profile): Promise<RegisterUserResponse | string> {
        const externalUserInfo = userExternalSerializer(profile);

        const userPreSerialized = await this._validateAndSerializeData({
            user: externalUserInfo as unknown as User,
            userDetails: {} as UserDetail,
        });

        if (typeof userPreSerialized === 'string') return userPreSerialized;

        const { userSerialized, userDetailsSerialized } = await this._enrichUser(
            {
                user: userPreSerialized.userSerialized,
                userDetails: userPreSerialized.userDetailsSerialized,
            },
            'facebook'
        );

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');
        this._logger('info', 'Registration in the database made with Facebook was successful');

        userRegistered._doc.inProgress = { status: 'wait_to_complete', code: null };

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }

    public async discord(profile: Discord.Profile): Promise<RegisterUserResponse | string> {
        const externalUserInfo = userExternalSerializer(profile);

        const userPreSerialized = await this._validateAndSerializeData({
            user: externalUserInfo as unknown as User,
            userDetails: {} as UserDetail,
        });

        if (typeof userPreSerialized === 'string') return userPreSerialized;

        const { userSerialized, userDetailsSerialized } = await this._enrichUser(
            {
                user: userPreSerialized.userSerialized,
                userDetails: userPreSerialized.userDetailsSerialized,
            },
            'discord'
        );

        // @ts-expect-error The object here is retuned from mongo, the entity is inside _doc field
        const userRegistered: User & { _doc: any } = await this._model.create(userSerialized);
        this._logger('info', 'User saved on database');

        userDetailsSerialized.userId = userRegistered._id;

        const userDetailsRegistered = await this._modelDetails.create(userDetailsSerialized);
        this._logger('info', 'User details saved on database');
        this._logger('info', 'Registration in the database made with Discord was successful');

        userRegistered._doc.inProgress = { status: 'wait_to_complete', code: null };

        return {
            ...userRegistered._doc,
            details: userDetailsRegistered,
        };
    }

    public async validateTwoFactor(userId: string, token: string): Promise<boolean> {
        const user = (await this._model.findOne(userId)) as User;

        if (!user) HttpRequestErrors.throwError('user');
        if (!user.twoFactorSecret) HttpRequestErrors.throwError('2fa');

        // @ts-expect-error Assertion made in line 168
        if (user.twoFactorSecret.qrcode) {
        // @ts-expect-error Assertion made in line 168
            delete user.twoFactorSecret.qrcode;
            await this._model.update(user._id as string, user);
        }

        const validateSecret = speakeasy.totp.verify({
        // @ts-expect-error Assertion made in line 168
            secret: user.twoFactorSecret.code as string,
            encoding: 'base32',
            token,
        });

        if (!validateSecret) HttpRequestErrors.throwError('2fa-incorrect');

        return validateSecret;
    }
}
