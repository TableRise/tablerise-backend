import JWT from 'jsonwebtoken';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';

export default class JWTGenerator {
    static generate(user: UserInstance): string {
        const payload = {
            userId: user.userId,
            providerId: user.providerId,
            username: `${user.nickname}${user.tag}`,
        };

        const token = JWT.sign(payload, (process.env.JWT_SECRET as string) || 'secret', {
            algorithm: 'HS256',
            expiresIn: '1d',
        });

        return token;
    }

    static verify(token: string): JWT.JwtPayload | boolean {
        try {
            const payload = JWT.verify(
                token,
                (process.env.JWT_SECRET as string) || 'secret'
            );
            return payload as JWT.JwtPayload;
        } catch (error) {
            return false;
        }
    }
}
