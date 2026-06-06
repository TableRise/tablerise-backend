import nodemailer from 'nodemailer';

export interface EmailSenderContract {
    nodemailer:
        | nodemailer.Transport
        | nodemailer.SendMailOptions
        | nodemailer.SentMessageInfo
        | nodemailer.TestAccount
        | nodemailer.TransportOptions
        | nodemailer.Transporter;
    emailType: 'common' | 'confirmation' | 'donation' | 'support' | 'verification';
}

export type EmailSenderType = 'common' | 'confirmation' | 'donation' | 'support' | 'verification';

export interface CommonContent {
    username?: string;
    userEmail?: string;
    userId?: string;
    campaignId?: string;
    campaignCode?: string;
    category?: string;
    title?: string;
    value?: number;
    timestamp?: string;
    verificationCode?: string;
    subject?: string;
    body?: string;
    replyTo?: string;
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
    replyTo?: string;
    text?: string;
}
