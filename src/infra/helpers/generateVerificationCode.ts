export default function generateVerificationCode(size: number): string {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    for (let i = 0; i < size; i += 1) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}
