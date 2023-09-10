export type EmailSenderType = 'confirmation' | 'newsletter' | 'common';

export interface CommonContent {
    subject: string;
    body: string;
}

export interface ResponseEmailSender {
    success: boolean;
}

export interface EmailMessage {
    from: string;
    to: string;
    subject: string;
    html?: string;
    text?: string;
}
