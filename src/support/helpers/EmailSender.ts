import 'dotenv/config';
import nodemailer from 'nodemailer';
import { EmailSenderType, CommonContent, EmailMessage, ResponseEmailSender } from 'src/types/Email';

const { EMAIL_SENDING_USER, EMAIL_SENDING_PASSWORD } = process.env;

export default class EmailSender {
    constructor(public type: EmailSenderType = 'common') {
        this.type = type;
    }

    static async handleEmail(contentType: 'html' | 'text', content: CommonContent, target: string): Promise<boolean> {
        const config = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: (EMAIL_SENDING_USER as string) || 'root',
                pass: (EMAIL_SENDING_PASSWORD as string) || 'secret',
            },
        };

        const message: EmailMessage = {
            from: 'TableRise <tablerise@gmail.com>',
            to: target,
            subject: content.subject,
        };

        // if (contentType === 'html') message.html = content.body;
        if (contentType === 'text') message.text = content.body;

        const transporter = nodemailer.createTransport(config);
        await transporter.sendMail(message);

        return true;
    }

    private async sendCommon(content: CommonContent, target: string): Promise<ResponseEmailSender> {
        const sendEmailResult = await EmailSender.handleEmail('text', content, target);
        return { success: sendEmailResult };
    }

    public async send(type: EmailSenderType, content: CommonContent, target: string): Promise<ResponseEmailSender> {
        const options = {
            common: this.sendCommon,
        };

        // @ts-expect-error :: The options below will with sure match with the string passed in arg type;
        const result = await options[type](content, target);
        return result;
    }
}
