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
