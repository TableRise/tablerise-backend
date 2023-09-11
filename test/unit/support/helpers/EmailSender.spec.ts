import EmailSender from 'src/support/helpers/EmailSender';

describe('Support :: Helpers :: EmailSender', () => {
    describe('When data is correct to send an email', () => {
        describe('And type is common', () => {
            const emailSender = new EmailSender();

            beforeAll(() => {
                jest.mock('nodemailer', () => ({
                    createTransport: jest.fn().mockReturnValue({
                        sendMail: jest.fn().mockResolvedValue(true),
                    }),
                }));
            });

            afterAll(() => {
                jest.clearAllMocks();
            });

            it('should return true when the process is done with success', async () => {
                const testContent = {
                    subject: 'Test',
                    body: 'Test',
                };

                const sendEmailTest = await emailSender.send('common', testContent, 'test@email.com');
                expect(sendEmailTest).toStrictEqual({ success: true });
            });
        });
    });
});
