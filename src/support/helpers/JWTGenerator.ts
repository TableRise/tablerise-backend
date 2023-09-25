import 'dotenv/config';
import JWT from 'jsonwebtoken';
import { User } from 'src/schemas/user/usersValidationSchema';

export default class JWTGenerator {
    static generate(user: User): string {
        const payload = {
            userId: user._id,
            providerId: user.providerId,
            username: `${user.nickname as string}${user.tag as string}`,
        };

        const token = JWT.sign(payload, (process.env.JWT_SECRET as string) || 'secret', {
            algorithm: 'HS256',
            expiresIn: '1d',
        });

        return token;
    }

    static verify(token: string): JWT.JwtPayload | boolean {
        try {
            const payload = JWT.verify(token, process.env.JWT_SECRET as string);
            return payload as JWT.JwtPayload;
        } catch (error) {
            return false;
        }
    }
}
