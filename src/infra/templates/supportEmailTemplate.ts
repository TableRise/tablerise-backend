import buildEmailLayout from './buildEmailLayout';

interface SupportEmailTemplateParams {
    title: string;
    category: string;
    content: string;
    senderName: string;
    senderEmail: string;
    campaignCode?: string;
}

export default function supportEmailTemplate({
    title,
    category,
    content,
    senderName,
    senderEmail,
    campaignCode,
}: SupportEmailTemplateParams): string {
    const sections = [
        { label: 'Titulo', value: title },
        { label: 'Categoria', value: category },
        { label: 'Solicitante', value: senderName },
        { label: 'Email de retorno', value: senderEmail },
        ...(campaignCode ? [{ label: 'Codigo da campanha', value: campaignCode }] : []),
        { label: 'Mensagem', value: content },
    ];

    return buildEmailLayout({
        preheader: `Nova solicitacao de suporte: ${title}`,
        title: 'Nova solicitacao de suporte',
        intro: 'Uma nova mensagem de suporte foi enviada por um usuario autenticado do TableRise.',
        heroImageUrl: 'https://i.ibb.co/3JZYpQn/putple-forest.webp',
        paragraphs: ['Revise os detalhes abaixo e responda diretamente para o email informado pelo usuario.'],
        sections,
    });
}
