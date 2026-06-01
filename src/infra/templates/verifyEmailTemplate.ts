import buildEmailLayout from './buildEmailLayout';

export default function verifyEmailTemplate(verifyCode: string, usernameUser: string): string {
    return buildEmailLayout({
        preheader: 'Verifique seu email no TableRise',
        title: 'Verifique seu email',
        intro: `Ola, ${usernameUser}. Use o codigo abaixo para validar o endereco de email vinculado a sua conta.`,
        heroImageUrl: 'https://i.ibb.co/qFrk7vZH/orange-lost-city.webp',
        highlight: verifyCode,
        paragraphs: [
            'Se voce nao reconhece esta solicitacao, nenhuma acao adicional e necessaria. Sua conta permanecera protegida.',
        ],
        footerNote: 'Este endereco e usado apenas para comunicacoes automatizadas do TableRise.',
    });
}
