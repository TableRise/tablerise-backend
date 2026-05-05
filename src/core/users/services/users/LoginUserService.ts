import { CookieOptions } from 'express';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import { JWTResponse } from 'src/types/api/users/methods';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';

export default class LoginUserService {
    private readonly usersDetailsRepository;
    private readonly logger;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['loginUserServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.enrichToken = this.enrichToken.bind(this);
        this.setCookieOptions = this.setCookieOptions.bind(this);
    }

    async enrichToken(token: string): Promise<JWTResponse> {
        this.logger('info', 'EnrichToken - LoginUserService');

        const tokenData = JWTGenerator.verify(token) as JWTResponse;

        delete tokenData.iat;
        delete tokenData.exp;

        const userDetails = await this.usersDetailsRepository.findOne({
            userId: tokenData.userId,
        });

        tokenData.fullname = userDetails.firstName + ' ' + userDetails.lastName;

        return tokenData;
    }

    setCookieOptions(): CookieOptions {
        this.logger('info', 'SetCookieOptions - LoginUserService');

        return {
            maxAge: 86_400_000,
            httpOnly: true,
            secure: process.env.COOKIE_SECURE === 'yes',
            sameSite: 'lax',
        };
    }
}
