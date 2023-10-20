import * as bcrypt from 'bcrypt';

export class SecurePasswordHandler {
    private static readonly saltRounds = 10;

    static async hashPassword(password: string): Promise<string> {
        const salt = await bcrypt.genSalt(this.saltRounds);
        const hashedPassword = await bcrypt.hash(password, salt);
        return hashedPassword;
    }

    static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
        const match = await bcrypt.compare(password, hashedPassword);
        return match;
    }
}
