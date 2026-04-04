import JWT from 'jsonwebtoken';
import User from '@tablerise/database-management/dist/src/interfaces/User';

export default class JWTGenerator {
    static generate(user: User): string {
        const payload = {
            userId: user.userId,
            providerId: user.providerId,
            username: `${user.nickname}${user.tag}`,
            picture: user.picture,
        };

        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');

        const token = JWT.sign(payload, (process.env.JWT_SECRET), {
            algorithm: 'HS256',
            expiresIn: '1d',
        });

        return token;
    }

    static verify(token: string): JWT.JwtPayload | boolean {
        if (!process.env.JWT_SECRET) throw new Error('JWT_SECRET environment variable is required');

        try {
            const payload = JWT.verify(token, (process.env.JWT_SECRET));
            return payload as JWT.JwtPayload;
        } catch (error) {
            return false;
        }
    }
}
