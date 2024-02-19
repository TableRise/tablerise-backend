import { CookieOptions } from 'express';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import { JWTResponse } from 'src/types/api/users/methods';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class LoginUserService {
    private readonly _usersDetailsRepository;
    private readonly _logger;

    constructor({
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['loginUserServiceContract']) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this.enrichToken = this.enrichToken.bind(this);
        this.setCookieOptions = this.setCookieOptions.bind(this);
    }

    async enrichToken(token: string): Promise<JWTResponse> {
        this._logger('info', 'EnrichToken - LoginUserService');

        const tokenData = JWTGenerator.verify(token) as JWTResponse;

        delete tokenData.iat;
        delete tokenData.exp;

        const userDetails = await this._usersDetailsRepository.findOne({
            userId: tokenData.userId,
        });

        tokenData.fullname = userDetails.firstName + ' ' + userDetails.lastName;

        return tokenData;
    }

    setCookieOptions(): CookieOptions {
        this._logger('info', 'SetCookieOptions - LoginUserService');

        return {
            maxAge: 3600000,
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === 'yes',
            sameSite: 'lax',
        };
    }
}
