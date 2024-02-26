import confirmEmailTemplate from 'src/infra/templates/confirmEmailTemplate';
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
    private readonly _nodemailer;

    constructor({ emailType, nodemailer }: EmailSenderContract) {
        this.type = emailType;
        this._nodemailer = nodemailer;

        this.handleEmail = this.handleEmail.bind(this);
        this.sendCommon = this.sendCommon.bind(this);
        this.sendConfirmation = this.sendConfirmation.bind(this);
        this.sendVerification = this.sendVerification.bind(this);
        this.send = this.send.bind(this);
    }

    public async handleEmail(
        contentType: 'html' | 'text',
        content: CommonContent,
        target: string
    ): Promise<boolean> {
        const { EMAIL_SENDING_USER, EMAIL_SENDING_PASSWORD, EMAIL_SENDING } = process.env;

        const config = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: EMAIL_SENDING_USER as string,
                pass: EMAIL_SENDING_PASSWORD as string,
            },
        };

        const message: EmailMessage = {
            from: 'TableRise <tablerise@gmail.com>',
            to: target,
            subject: content.subject as string,
        };

        if (contentType === 'html') message.html = content.body;
        if (contentType === 'text') message.text = content.body;

        const transporter = this._nodemailer.createTransport(config);
        if (EMAIL_SENDING === 'on') await transporter.sendMail(message);

        return true;
    }

    private async sendCommon(
        content: CommonContent,
        target: string
    ): Promise<ResponseEmailSender> {
        const sendEmailResult = await this.handleEmail('text', content, target);
        return { success: sendEmailResult };
    }

    private async sendConfirmation(
        content: CommonContent,
        target: string
    ): Promise<ResponseEmailSender> {
        const verificationCode = generateVerificationCode(6);
        const username = content.username ?? target;
        content.body = confirmEmailTemplate(verificationCode, username);

        const sendEmailResult = await this.handleEmail('html', content, target);
        return { success: sendEmailResult, verificationCode };
    }

    private async sendVerification(
        content: CommonContent,
        target: string
    ): Promise<ResponseEmailSender> {
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
            verification: this.sendVerification,
        };

        const result = await options[this.type](content, target);
        return result;
    }
}
