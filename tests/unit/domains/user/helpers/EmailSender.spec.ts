import EmailSender from 'src/domains/users/helpers/EmailSender';

describe('Domains :: User :: Helpers :: EmailSender', () => {
    let emailSender: EmailSender, nodemailer: any, emailType: any;

    context('When data is correct to send an email', () => {
        context('and type is common', () => {
            before(() => {
                emailType = 'common';
                nodemailer = {
                    createTransport: () => ({
                        sendMail: () => {},
                    }),
                };

                process.env.EMAIL_SENDING = 'on';
                emailSender = new EmailSender({ emailType, nodemailer });
            });

            after(() => {
                process.env.EMAIL_SENDING = 'off';
            });

            it('should return true when the process is done with success', async () => {
                const testContent = {
                    subject: 'Test',
                    body: 'Test',
                };

                const sendEmailTest = await emailSender.send(
                    testContent,
                    'test@email.com'
                );
                expect(sendEmailTest).to.deep.equal({ success: true });
            });
        });

        context('And type is confirmation', () => {
            beforeEach(() => {
                emailType = 'confirmation';
                nodemailer = {
                    createTransport: () => ({
                        sendMail: () => {},
                    }),
                };

                emailSender = new EmailSender({ emailType, nodemailer });
            });

            it('should return true when the process is done with success', async () => {
                const testContent = {
                    username: 'userTest',
                    subject: 'Test',
                    body: '',
                };

                const sendEmailTest = await emailSender.send(
                    testContent,
                    'test@email.com'
                );
                expect(sendEmailTest.success).to.be.equal(true);
                expect(typeof sendEmailTest.verificationCode).to.be.equal('string');
                expect(sendEmailTest.verificationCode?.length).to.be.equal(6);
            });

            it('should return true when the process is done with success without the username', async () => {
                const testContent = {
                    subject: 'Test',
                    body: '',
                };

                const sendEmailTest = await emailSender.send(
                    testContent,
                    'test@email.com'
                );
                expect(sendEmailTest.success).to.be.equal(true);
                expect(typeof sendEmailTest.verificationCode).to.be.equal('string');
                expect(sendEmailTest.verificationCode?.length).to.be.equal(6);
            });
        });

        context('And type is verification', () => {
            beforeEach(() => {
                emailType = 'verification';
                nodemailer = {
                    createTransport: () => ({
                        sendMail: () => {},
                    }),
                };

                emailSender = new EmailSender({ emailType, nodemailer });
            });

            it('should return true when the process is done with success', async () => {
                const testContent = {
                    username: 'userTest',
                    subject: 'Test',
                    body: '',
                };

                const sendEmailTest = await emailSender.send(
                    testContent,
                    'test@email.com'
                );
                expect(sendEmailTest.success).to.be.equal(true);
                expect(typeof sendEmailTest.verificationCode).to.be.equal('string');
                expect(sendEmailTest.verificationCode?.length).to.be.equal(6);
            });

            it('should return true when the process is done with success without the username', async () => {
                const testContent = {
                    subject: 'Test',
                    body: '',
                };

                const sendEmailTest = await emailSender.send(
                    testContent,
                    'test@email.com'
                );
                expect(sendEmailTest.success).to.be.equal(true);
                expect(typeof sendEmailTest.verificationCode).to.be.equal('string');
                expect(sendEmailTest.verificationCode?.length).to.be.equal(6);
            });
        });
    });
});
