import JWT from 'jsonwebtoken';
import crypto from 'crypto';
import { TokenForbiddenContract } from 'src/types/modules/domains/common/helpers/TokenForbidden';

export default class TokenForbidden {
    private readonly _redisClient;
    private readonly _logger;

    constructor({ redisClient, logger }: TokenForbiddenContract) {
        this._logger = logger;
        this._redisClient = redisClient;
    }

    private _generateTokenHash(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async addToken(token: string): Promise<void> {
        this._logger('info', 'AddToken - TokenFobidden');
        const tokenInfo = JWT.decode(token) as JWT.JwtPayload;
        const tokenExpirationDate = tokenInfo.exp;

        const tokenHash = this._generateTokenHash(token);

        await this._redisClient.set(tokenHash, '');
        await this._redisClient.expireAt(tokenHash, tokenExpirationDate);
    }

    async verifyForbiddenToken(token: string): Promise<boolean> {
        this._logger('info', 'VerifyForbiddenToken - TokenFobidden');
        const tokenHash = this._generateTokenHash(token);

        const tokenExists =
            process.env.TEST_TYPE !== 'integration'
                ? await this._redisClient.exists(tokenHash)
                : 0;

        return tokenExists > 0;
    }
}
