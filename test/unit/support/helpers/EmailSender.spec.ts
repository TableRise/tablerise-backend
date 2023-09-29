import EmailSender from 'src/support/helpers/EmailSender';

jest.mock('nodemailer', () => ({
    createTransport: jest.fn().mockReturnValue({
        sendMail: jest.fn().mockResolvedValueOnce(true),
    }),
}));

describe('Support :: Helpers :: EmailSender', () => {
    describe('When data is correct to send an email', () => {
        describe('And type is common', () => {
            const emailSender = new EmailSender();

            it('should return true when the process is done with success', async () => {
                const testContent = {
                    subject: 'Test',
                    body: 'Test',
                };

                const sendEmailTest = await emailSender.send('common', testContent, 'test@email.com');
                expect(sendEmailTest).toStrictEqual({ success: true });
            });
        });

        describe('And type is confirmation', () => {
            const emailSender = new EmailSender();

            it('should return true when the process is done with success', async () => {
                const testContent = {
                    username: 'userTest',
                    verificationCode: '123456',
                    subject: 'Test',
                    body: '',
                };

                const sendEmailTest = await emailSender.send('confirmation', testContent, 'test@email.com');
                expect(sendEmailTest.success).toBe(true);
                expect(typeof sendEmailTest.verificationCode).toBe('string');
                expect(sendEmailTest.verificationCode?.length).toBe(6);
            });

            it('should return true when the process is done with success without the username', async () => {
                const testContent = {
                    subject: 'Test',
                    verificationCode: '123456',
                    body: '',
                };

                const sendEmailTest = await emailSender.send('confirmation', testContent, 'test@email.com');
                expect(sendEmailTest.success).toBe(true);
                expect(typeof sendEmailTest.verificationCode).toBe('string');
                expect(sendEmailTest.verificationCode?.length).toBe(6);
            });

            it('should return false when the process is done with success without the verification code', async () => {
                const testContent = {
                    subject: 'Test',
                    body: '',
                };

                const sendEmailTest = await emailSender.send('confirmation', testContent, 'test@email.com');
                expect(sendEmailTest.success).toBe(false);
            });
        });
    });
});
