import buildEmailLayout from './buildEmailLayout';

export default function confirmEmailTemplate(verifyCode: string, usernameUser: string): string {
    return buildEmailLayout({
        preheader: 'Confirme seu cadastro no TableRise',
        title: 'Confirme seu cadastro',
        intro: `Ola, ${usernameUser}. Para concluir a criacao da sua conta, use o codigo abaixo no TableRise.`,
        heroImageUrl: 'https://i.ibb.co/1tLhWbD6/purple-lost-city.webp',
        highlight: verifyCode,
        paragraphs: ['Este codigo e pessoal e temporario. Se voce nao solicitou este cadastro, ignore este email.'],
        footerNote: 'Este endereco e usado apenas para comunicacoes automatizadas do TableRise.',
    });
}
