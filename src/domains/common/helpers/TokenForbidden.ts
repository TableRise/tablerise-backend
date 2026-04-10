import JWT from 'jsonwebtoken';
import crypto from 'crypto';
import { TokenForbiddenContract } from 'src/types/modules/domains/common/helpers/TokenForbidden';

export default class TokenForbidden {
    private readonly redisClient;
    private readonly logger;

    constructor({ redisClient, logger }: TokenForbiddenContract) {
        this.logger = logger;
        this.redisClient = redisClient;
    }

    private generateTokenHash(token: string): string {
        return crypto.createHash('sha256').update(token).digest('hex');
    }

    async addToken(token: string): Promise<void> {
        this.logger('info', 'AddToken - TokenFobidden');
        if (process.env.TEST_TYPE === 'integration') return;

        const tokenInfo = JWT.decode(token) as JWT.JwtPayload;
        const tokenExpirationDate = tokenInfo.exp;

        const tokenHash = this.generateTokenHash(token);

        await this.redisClient.set(tokenHash, '');
        await this.redisClient.expireAt(tokenHash, tokenExpirationDate);
    }

    async verifyForbiddenToken(token: string): Promise<boolean> {
        this.logger('info', 'VerifyForbiddenToken - TokenFobidden');
        const tokenHash = this.generateTokenHash(token);

        const tokenExists = process.env.TEST_TYPE !== 'integration' ? await this.redisClient.exists(tokenHash) : 0;

        return tokenExists > 0;
    }
}
