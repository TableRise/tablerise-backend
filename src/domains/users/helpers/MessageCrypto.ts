import crypto from 'crypto';
import { EncryptedMessagePayload, MessagePlaintextPayload, StoredUserMessage } from 'src/types/api/users/http/payload';

const ALGORITHM = 'aes-256-gcm';
const KEY_VERSION = 1;
const NONCE_LENGTH = 12;

export default class MessageCrypto {
    private getMasterKey(): Buffer {
        const rawKey = process.env.MESSAGE_ENCRYPTION_KEY;

        if (!rawKey) throw new Error('MESSAGE_ENCRYPTION_KEY environment variable is required');

        const key = Buffer.from(rawKey, 'base64');

        if (key.length !== 32) {
            throw new Error('MESSAGE_ENCRYPTION_KEY must be a base64-encoded 32-byte key');
        }

        return key;
    }

    private deriveFieldKey(field: 'title' | 'content'): Buffer {
        return crypto.createHmac('sha256', this.getMasterKey()).update(`messages:${field}:v${KEY_VERSION}`).digest();
    }

    private encryptField(value: string, key: Buffer, nonce: Buffer): string {
        const cipher = crypto.createCipheriv(ALGORITHM, key, nonce);
        const encrypted = Buffer.concat([cipher.update(value, 'utf8'), cipher.final()]);
        const authTag = cipher.getAuthTag();

        return `${encrypted.toString('base64')}:${authTag.toString('base64')}`;
    }

    private decryptField(value: string, key: Buffer, nonce: Buffer): string {
        const [ciphertext, authTag] = value.split(':');

        if (!ciphertext || !authTag) throw new Error('Encrypted message payload is invalid');

        const decipher = crypto.createDecipheriv(ALGORITHM, key, nonce);
        decipher.setAuthTag(Buffer.from(authTag, 'base64'));

        const decrypted = Buffer.concat([decipher.update(Buffer.from(ciphertext, 'base64')), decipher.final()]);

        return decrypted.toString('utf8');
    }

    public encrypt({ title, content }: MessagePlaintextPayload): EncryptedMessagePayload {
        const nonce = crypto.randomBytes(NONCE_LENGTH);

        return {
            encryptedTitle: this.encryptField(title, this.deriveFieldKey('title'), nonce),
            encryptedContent: this.encryptField(content, this.deriveFieldKey('content'), nonce),
            nonce: nonce.toString('base64'),
            keyVersion: KEY_VERSION,
            algorithm: ALGORITHM,
        };
    }

    public decrypt(message: Pick<StoredUserMessage, keyof EncryptedMessagePayload>): MessagePlaintextPayload {
        if (message.keyVersion !== KEY_VERSION) {
            throw new Error(`Unsupported message key version: ${message.keyVersion}`);
        }

        if (message.algorithm !== ALGORITHM) {
            throw new Error(`Unsupported message algorithm: ${message.algorithm}`);
        }

        const nonce = Buffer.from(message.nonce, 'base64');

        return {
            title: this.decryptField(message.encryptedTitle, this.deriveFieldKey('title'), nonce),
            content: this.decryptField(message.encryptedContent, this.deriveFieldKey('content'), nonce),
        };
    }
}
