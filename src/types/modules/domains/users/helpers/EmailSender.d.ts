import nodemailer from 'nodemailer';

export interface EmailSenderContract {
    nodemailer:
        | nodemailer.Transport
        | nodemailer.SendMailOptions
        | nodemailer.SentMessageInfo
        | nodemailer.TestAccount
        | nodemailer.TransportOptions
        | nodemailer.Transporter;
    emailType: 'common' | 'confirmation' | 'verification';
}

export type EmailSenderType = 'confirmation' | 'newsletter' | 'common' | 'verification';

export interface CommonContent {
    username?: string;
    verificationCode?: string;
    subject?: string;
    body?: string;
}

export interface ResponseEmailSender {
    success: boolean;
    verificationCode?: string;
}

export interface EmailMessage {
    from: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
}
