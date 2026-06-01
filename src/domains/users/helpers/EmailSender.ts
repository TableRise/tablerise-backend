import confirmEmailTemplate from 'src/infra/templates/confirmEmailTemplate';
import supportEmailTemplate from 'src/infra/templates/supportEmailTemplate';
import verifyEmailTemplate from 'src/infra/templates/verifyEmailTemplate';
import generateVerificationCode from 'src/domains/users/helpers/generateVerificationCode';
import {
    EmailSenderContract,
    CommonContent,
    EmailMessage,
    ResponseEmailSender,
} from 'src/types/modules/domains/users/helpers/EmailSender';

export default class EmailSender {
    public type;
    private readonly nodemailer;

    constructor({ emailType, nodemailer }: EmailSenderContract) {
        this.type = emailType;
        this.nodemailer = nodemailer;

        this.handleEmail = this.handleEmail.bind(this);
        this.sendCommon = this.sendCommon.bind(this);
        this.sendConfirmation = this.sendConfirmation.bind(this);
        this.sendSupport = this.sendSupport.bind(this);
        this.sendVerification = this.sendVerification.bind(this);
        this.resolveTransportConfig = this.resolveTransportConfig.bind(this);
        this.resolveFromAddress = this.resolveFromAddress.bind(this);
        this.send = this.send.bind(this);
    }

    private resolveTransportConfig(): {
        host: string;
        port: number;
        secure: boolean;
        auth: {
            user: string;
            pass: string;
        };
    } {
        const host = process.env.SMTP_HOST as string;
        const port = Number(process.env.SMTP_PORT);
        const secure = ['1', 'on', 'true'].includes((process.env.SMTP_SECURE ?? '').toLowerCase());
        const user = process.env.SMTP_USER as string;
        const pass = process.env.SMTP_PASS as string;

        return {
            host,
            port,
            secure,
            auth: {
                user,
                pass,
            },
        };
    }

    private resolveFromAddress(): string {
        return process.env.EMAIL_FROM as string;
    }

    public async handleEmail(contentType: 'html' | 'text', content: CommonContent, target: string): Promise<boolean> {
        const emailEnabled = process.env.EMAIL_ENABLED;
        const config = this.resolveTransportConfig();

        const message: EmailMessage = {
            from: this.resolveFromAddress(),
            to: target,
            subject: content.subject as string,
        };

        if (contentType === 'html') message.html = content.body;
        if (contentType === 'text') message.text = content.body;
        if (content.replyTo) message.replyTo = content.replyTo;

        const transporter = this.nodemailer.createTransport(config);
        if (emailEnabled === 'on') await transporter.sendMail(message);

        return true;
    }

    private async sendCommon(content: CommonContent, target: string): Promise<ResponseEmailSender> {
        const sendEmailResult = await this.handleEmail('text', content, target);
        return { success: sendEmailResult };
    }

    private async sendConfirmation(content: CommonContent, target: string): Promise<ResponseEmailSender> {
        const verificationCode = generateVerificationCode(6);
        const username = content.username ?? target;
        content.body = confirmEmailTemplate(verificationCode, username);

        const sendEmailResult = await this.handleEmail('html', content, target);
        return { success: sendEmailResult, verificationCode };
    }

    private async sendSupport(content: CommonContent, target: string): Promise<ResponseEmailSender> {
        const username = content.username ?? target;
        const userEmail = content.userEmail ?? target;
        const title = content.title ?? 'Solicitacao de suporte';
        const category = content.category ?? 'Geral';
        const messageContent = content.body ?? '';

        content.body = supportEmailTemplate({
            title,
            category,
            content: messageContent,
            senderName: username,
            senderEmail: userEmail,
            campaignCode: content.campaignCode,
        });

        const sendEmailResult = await this.handleEmail('html', content, target);
        return { success: sendEmailResult };
    }

    private async sendVerification(content: CommonContent, target: string): Promise<ResponseEmailSender> {
        const verificationCode = generateVerificationCode(6);
        const username = content.username ?? target;
        content.body = verifyEmailTemplate(verificationCode, username);

        const sendEmailResult = await this.handleEmail('html', content, target);
        return { success: sendEmailResult, verificationCode };
    }

    public async send(content: CommonContent, target: string): Promise<ResponseEmailSender> {
        const options = {
            common: this.sendCommon,
            confirmation: this.sendConfirmation,
            support: this.sendSupport,
            verification: this.sendVerification,
        };

        const result = await options[this.type](content, target);
        return result;
    }
}
