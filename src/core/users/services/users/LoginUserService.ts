import { CookieOptions } from 'express';
import JWTGenerator from 'src/domains/users/helpers/JWTGenerator';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { JWTResponse } from 'src/types/api/users/methods';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import {
    addXp,
    finalizeProgression,
    snapshotProgression,
    USER_XP_EVENTS,
} from 'src/domains/users/helpers/UserProgression';

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
        const callName = `[${this.constructor.name}] - ${this.enrichToken.name}`;
        this.logger('info', callName);

        const tokenData = JWTGenerator.verify(token) as JWTResponse;

        delete tokenData.iat;
        delete tokenData.exp;

        const userDetails = await this.usersDetailsRepository.findOne({
            userId: tokenData.userId,
        });
        if (!userDetails) HttpRequestErrors.throwError('user-inexistent');

        const progressionSnapshot = snapshotProgression(userDetails);
        addXp(userDetails, USER_XP_EVENTS.LOGIN);
        finalizeProgression(userDetails, progressionSnapshot);

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetails.userDetailId },
            payload: userDetails,
        });

        tokenData.fullname = userDetails.firstName + ' ' + userDetails.lastName;

        return tokenData;
    }

    setCookieOptions(): CookieOptions {
        const callName = `[${this.constructor.name}] - ${this.setCookieOptions.name}`;
        this.logger('info', callName);
        const secure = process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'yes';

        return {
            maxAge: 86_400_000,
            httpOnly: true,
            secure,
            domain: process.env.DOMAIN_COOKIE,
            sameSite: secure ? 'none' : 'lax',
        };
    }
}
