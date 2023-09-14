import * as bcrypt from 'bcrypt';

export class SecurePasswordHandler {
  private static readonly saltRounds = 10;

  static async hashPassword(password: string): Promise<string> {
    try {
      const salt = await bcrypt.genSalt(this.saltRounds);
      const hashedPassword = await bcrypt.hash(password, salt);
      return hashedPassword;
    } catch (error) {
      throw new Error('Error hashing password');
    }
  }
}
