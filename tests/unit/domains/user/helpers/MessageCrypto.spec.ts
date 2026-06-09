import MessageCrypto from 'src/domains/users/helpers/MessageCrypto';

describe('Domains :: User :: Helpers :: MessageCrypto', () => {
    const validKey = 'MTIzNDU2Nzg5MDEyMzQ1Njc4OTAxMjM0NTY3ODkwMTI=';
    let previousKey: string | undefined;

    beforeEach(() => {
        previousKey = process.env.MESSAGE_ENCRYPTION_KEY;
    });

    afterEach(() => {
        process.env.MESSAGE_ENCRYPTION_KEY = previousKey;
    });

    it('should encrypt and decrypt one message payload', () => {
        process.env.MESSAGE_ENCRYPTION_KEY = validKey;
        const messageCrypto = new MessageCrypto();

        const encrypted = messageCrypto.encrypt({
            title: 'Hello',
            content: 'Encrypted content',
        });

        const decrypted = messageCrypto.decrypt(encrypted);

        expect(decrypted).to.deep.equal({
            title: 'Hello',
            content: 'Encrypted content',
        });
    });

    it('should generate different ciphertext for the same plaintext across calls', () => {
        process.env.MESSAGE_ENCRYPTION_KEY = validKey;
        const messageCrypto = new MessageCrypto();

        const first = messageCrypto.encrypt({
            title: 'Hello',
            content: 'Encrypted content',
        });
        const second = messageCrypto.encrypt({
            title: 'Hello',
            content: 'Encrypted content',
        });

        expect(first.nonce).to.not.equal(second.nonce);
        expect(first.encryptedTitle).to.not.equal(second.encryptedTitle);
        expect(first.encryptedContent).to.not.equal(second.encryptedContent);
    });

    it('should reject missing or invalid encryption keys', () => {
        delete process.env.MESSAGE_ENCRYPTION_KEY;
        const missingKeyCrypto = new MessageCrypto();

        expect(() =>
            missingKeyCrypto.encrypt({
                title: 'Hello',
                content: 'Encrypted content',
            })
        ).to.throw('MESSAGE_ENCRYPTION_KEY environment variable is required');

        process.env.MESSAGE_ENCRYPTION_KEY = Buffer.from('short').toString('base64');
        const invalidKeyCrypto = new MessageCrypto();

        expect(() =>
            invalidKeyCrypto.encrypt({
                title: 'Hello',
                content: 'Encrypted content',
            })
        ).to.throw('MESSAGE_ENCRYPTION_KEY must be a base64-encoded 32-byte key');
    });
});
