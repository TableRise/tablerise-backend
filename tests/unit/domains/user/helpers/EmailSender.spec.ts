import EmailSender from 'src/domains/users/helpers/EmailSender';

describe('Domains :: User :: Helpers :: EmailSender', () => {
    let transportConfig: any;
    let sentMessage: any;

    const buildNodemailer = () => ({
        createTransport: (config) => {
            transportConfig = config;

            return {
                sendMail: (message) => {
                    sentMessage = message;
                },
            };
        },
    });

    beforeEach(() => {
        transportConfig = undefined;
        sentMessage = undefined;

        process.env.SMTP_HOST = 'smtp.mailtrap.io';
        process.env.SMTP_PORT = '2525';
        process.env.SMTP_SECURE = 'true';
        process.env.SMTP_USER = 'mailtrap-user';
        process.env.SMTP_PASS = 'mailtrap-pass';
        process.env.EMAIL_FROM = 'TableRise <support@tablerise.com>';
        process.env.EMAIL_ENABLED = 'on';
    });

    afterEach(() => {
        delete process.env.SMTP_HOST;
        delete process.env.SMTP_PORT;
        delete process.env.SMTP_SECURE;
        delete process.env.SMTP_USER;
        delete process.env.SMTP_PASS;
        delete process.env.EMAIL_FROM;
        delete process.env.EMAIL_ENABLED;
    });

    it('should send a common email as plain text', async () => {
        const emailSender = new EmailSender({ emailType: 'common', nodemailer: buildNodemailer() as any });

        const sendEmailTest = await emailSender.send(
            {
                subject: 'Test',
                body: 'Test body',
            },
            'test@email.com'
        );

        expect(sendEmailTest).to.deep.equal({ success: true });
        expect(sentMessage.text).to.equal('Test body');
        expect(sentMessage.html).to.be.undefined();
    });

    it('should build the transport from env vars', async () => {
        const emailSender = new EmailSender({ emailType: 'common', nodemailer: buildNodemailer() as any });

        await emailSender.send(
            {
                subject: 'Test',
                body: 'Test body',
            },
            'test@email.com'
        );

        expect(transportConfig).to.deep.equal({
            host: 'smtp.mailtrap.io',
            port: 2525,
            secure: true,
            auth: {
                user: 'mailtrap-user',
                pass: 'mailtrap-pass',
            },
        });
    });

    it('should fallback SMTP secure to false when the env var is missing', async () => {
        delete process.env.SMTP_SECURE;

        const emailSender = new EmailSender({ emailType: 'common', nodemailer: buildNodemailer() as any });

        await emailSender.send(
            {
                subject: 'Test',
                body: 'Test body',
            },
            'test@email.com'
        );

        expect(transportConfig.secure).to.equal(false);
    });

    it('should skip sendMail when email sending is disabled', async () => {
        process.env.EMAIL_ENABLED = 'off';

        const emailSender = new EmailSender({ emailType: 'common', nodemailer: buildNodemailer() as any });

        const sendEmailTest = await emailSender.send(
            {
                subject: 'Test',
                body: 'Test body',
            },
            'test@email.com'
        );

        expect(sendEmailTest).to.deep.equal({ success: true });
        expect(sentMessage).to.be.undefined();
    });

    it('should render the confirmation email template', async () => {
        const emailSender = new EmailSender({ emailType: 'confirmation', nodemailer: buildNodemailer() as any });

        const sendEmailTest = await emailSender.send(
            {
                username: 'userTest',
                subject: 'Confirmacao',
            },
            'test@email.com'
        );

        expect(sendEmailTest.success).to.equal(true);
        expect(sendEmailTest.verificationCode).to.have.lengthOf(6);
        expect(sentMessage.html).to.contain('Confirme seu cadastro');
        expect(sentMessage.html).to.contain('class="img-bg"');
        expect(sentMessage.html).to.not.contain('<img');
    });

    it('should fallback confirmation username to the target email', async () => {
        const emailSender = new EmailSender({ emailType: 'confirmation', nodemailer: buildNodemailer() as any });

        await emailSender.send(
            {
                subject: 'Confirmacao',
            },
            'target@email.com'
        );

        expect(sentMessage.html).to.contain('target@email.com');
    });

    it('should render the donation email template', async () => {
        const emailSender = new EmailSender({ emailType: 'donation', nodemailer: buildNodemailer() as any });

        const sendEmailTest = await emailSender.send(
            {
                username: 'Lia',
                userId: '12cd093b-0a8a-42fe-910f-001f2ab28454',
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                subject: 'Donation validation - TableRise',
            },
            'rwd.tablesrise.ttrpg@gmail.com'
        );

        expect(sendEmailTest).to.deep.equal({ success: true });
        expect(sentMessage.html).to.contain('Donation Validation Request');
        expect(sentMessage.html).to.contain('Lia');
        expect(sentMessage.html).to.contain('12cd093b-0a8a-42fe-910f-001f2ab28454');
        expect(sentMessage.html).to.contain('15.00');
        expect(sentMessage.html).to.contain('2026-06-03T12:30:00.000Z');
    });

    it('should fallback donation email fields to safe defaults', async () => {
        const emailSender = new EmailSender({ emailType: 'donation', nodemailer: buildNodemailer() as any });

        await emailSender.send(
            {
                subject: 'Donation validation - TableRise',
            },
            'rwd.tablesrise.ttrpg@gmail.com'
        );

        expect(sentMessage.html).to.contain('Anonymous');
        expect(sentMessage.html).to.contain('User ID:</strong> ');
        expect(sentMessage.html).to.contain('0.00');
        expect(sentMessage.html).to.contain('Timestamp:</strong> ');
    });

    it('should render the verification email template', async () => {
        const emailSender = new EmailSender({ emailType: 'verification', nodemailer: buildNodemailer() as any });

        const sendEmailTest = await emailSender.send(
            {
                username: 'userTest',
                subject: 'Verificacao',
            },
            'test@email.com'
        );

        expect(sendEmailTest.success).to.equal(true);
        expect(sendEmailTest.verificationCode).to.have.lengthOf(6);
        expect(sentMessage.html).to.contain('Verifique seu email');
        expect(sentMessage.html).to.contain('class="img-bg"');
        expect(sentMessage.html).to.not.contain('<img');
    });

    it('should fallback verification username to the target email', async () => {
        const emailSender = new EmailSender({ emailType: 'verification', nodemailer: buildNodemailer() as any });

        await emailSender.send(
            {
                subject: 'Verificacao',
            },
            'target@email.com'
        );

        expect(sentMessage.html).to.contain('target@email.com');
    });

    it('should render the support email template and include replyTo', async () => {
        const emailSender = new EmailSender({ emailType: 'support', nodemailer: buildNodemailer() as any });

        const sendEmailTest = await emailSender.send(
            {
                username: 'Joe Einstein',
                userEmail: 'joe@email.com',
                title: 'Nao consigo entrar',
                category: 'Autenticacao',
                campaignCode: 'ABC123',
                body: 'Meu codigo nao chega.',
                subject: 'Solicitacao de suporte - TableRise',
                replyTo: 'joe@email.com',
            },
            process.env.EMAIL_FROM as string
        );

        expect(sendEmailTest).to.deep.equal({ success: true });
        expect(sentMessage.replyTo).to.equal('joe@email.com');
        expect(sentMessage.html).to.contain('Nao consigo entrar');
        expect(sentMessage.html).to.contain('Autenticacao');
        expect(sentMessage.html).to.contain('ABC123');
        expect(sentMessage.html).to.contain('joe@email.com');
    });

    it('should omit the campaign code section when support email has no campaign code', async () => {
        const emailSender = new EmailSender({ emailType: 'support', nodemailer: buildNodemailer() as any });

        await emailSender.send(
            {
                username: 'Joe Einstein',
                userEmail: 'joe@email.com',
                title: 'Nao consigo entrar',
                category: 'Autenticacao',
                body: 'Meu codigo nao chega.',
                subject: 'Solicitacao de suporte - TableRise',
                replyTo: 'joe@email.com',
            },
            process.env.EMAIL_FROM as string
        );

        expect(sentMessage.html).to.not.contain('Codigo da campanha');
    });

    it('should fallback support email fields to safe defaults', async () => {
        const emailSender = new EmailSender({ emailType: 'support', nodemailer: buildNodemailer() as any });

        await emailSender.send(
            {
                subject: 'Solicitacao de suporte - TableRise',
            },
            'support@email.com'
        );

        expect(sentMessage.html).to.contain('support@email.com');
        expect(sentMessage.html).to.contain('Solicitacao de suporte');
        expect(sentMessage.html).to.contain('Geral');
    });
});
