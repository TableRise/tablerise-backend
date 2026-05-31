interface EmailLayoutSection {
    label: string;
    value: string;
}

interface BuildEmailLayoutParams {
    preheader: string;
    title: string;
    intro: string;
    heroImageUrl: string;
    highlight?: string;
    paragraphs?: string[];
    sections?: EmailLayoutSection[];
    footerNote?: string;
}

const escapeHtml = (value: string): string =>
    value
        .split('&')
        .join('&amp;')
        .split('<')
        .join('&lt;')
        .split('>')
        .join('&gt;')
        .split('"')
        .join('&quot;')
        .split("'")
        .join('&#39;');

const renderSections = (sections: EmailLayoutSection[] = []): string =>
    sections
        .map(
            ({ label, value }) => `
                <div class="info-row">
                    <span class="info-label">${escapeHtml(label)}</span>
                    <span class="info-value">${escapeHtml(value)}</span>
                </div>
            `
        )
        .join('');

const renderParagraphs = (paragraphs: string[] = []): string =>
    paragraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join('');

export default function buildEmailLayout({
    preheader,
    title,
    intro,
    heroImageUrl,
    highlight,
    paragraphs = [],
    sections = [],
    footerNote = 'Se voce precisar de ajuda, responda este email ou entre em contato com a equipe TableRise.',
}: BuildEmailLayoutParams): string {
    const safeTitle = escapeHtml(title);
    const safeIntro = escapeHtml(intro);
    const safePreheader = escapeHtml(preheader);
    const safeHighlight = highlight ? escapeHtml(highlight) : '';
    const safeFooterNote = escapeHtml(footerNote);

    return `<!DOCTYPE html>
<html lang="pt-BR">
    <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>${safeTitle}</title>
        <style>
            body {
                margin: 0;
                padding: 0;
                background-color: #eef4ff;
                color: #16213a;
                font-family: Arial, Helvetica, sans-serif;
            }

            .preheader {
                display: none;
                max-height: 0;
                max-width: 0;
                opacity: 0;
                overflow: hidden;
                mso-hide: all;
            }

            .email-wrapper {
                width: 100%;
                padding: 24px 12px;
                box-sizing: border-box;
            }

            .email-card {
                width: 100%;
                max-width: 640px;
                margin: 0 auto;
                background-color: #ffffff;
                border: 1px solid #d6e3ff;
                border-radius: 20px;
                overflow: hidden;
                box-shadow: 0 14px 40px rgba(20, 44, 94, 0.12);
            }

            .img-bg {
                width: 100%;
                height: 220px;
                background: linear-gradient(rgba(20, 24, 66, 0.24), rgba(20, 24, 66, 0.24)),
                    url('${escapeHtml(heroImageUrl)}') center / cover no-repeat;
            }

            .content {
                padding: 32px 28px;
            }

            .eyebrow {
                margin: 0 0 12px;
                color: #2f5aa8;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }

            h1 {
                margin: 0 0 16px;
                color: #141842;
                font-size: 30px;
                line-height: 1.2;
            }

            p {
                margin: 0 0 16px;
                color: #38507f;
                font-size: 16px;
                line-height: 1.65;
            }

            .highlight-box {
                margin: 24px 0;
                padding: 18px 20px;
                border-radius: 16px;
                background-color: #edf4ff;
                border: 1px solid #c5d9ff;
                color: #1d3f82;
                font-size: 28px;
                font-weight: 700;
                letter-spacing: 0.1em;
                text-align: center;
            }

            .details-box {
                margin: 24px 0;
                padding: 20px;
                border-radius: 16px;
                background-color: #f7faff;
                border: 1px solid #d9e6ff;
            }

            .info-row + .info-row {
                margin-top: 12px;
                padding-top: 12px;
                border-top: 1px solid #d9e6ff;
            }

            .info-label {
                display: block;
                margin-bottom: 4px;
                color: #2f5aa8;
                font-size: 12px;
                font-weight: 700;
                letter-spacing: 0.08em;
                text-transform: uppercase;
            }

            .info-value {
                display: block;
                color: #141842;
                font-size: 16px;
                line-height: 1.55;
                white-space: pre-wrap;
                word-break: break-word;
            }

            .footer {
                padding: 20px 28px 28px;
                background-color: #141842;
                color: #ffffff;
                font-size: 13px;
                line-height: 1.6;
            }

            .footer p {
                color: #ffffff;
            }

            @media (max-width: 640px) {
                .email-wrapper {
                    padding: 0;
                }

                .email-card {
                    border-radius: 0;
                    border-left: 0;
                    border-right: 0;
                }

                .img-bg {
                    height: 176px;
                }

                .content,
                .footer {
                    padding-left: 20px;
                    padding-right: 20px;
                }

                h1 {
                    font-size: 26px;
                }

                .highlight-box {
                    font-size: 22px;
                }
            }
        </style>
    </head>
    <body>
        <div class="preheader">${safePreheader}</div>
        <div class="email-wrapper">
            <section class="email-card">
                <div class="img-bg"></div>
                <div class="content">
                    <p class="eyebrow">TableRise</p>
                    <h1>${safeTitle}</h1>
                    <p>${safeIntro}</p>
                    ${highlight ? `<div class="highlight-box">${safeHighlight}</div>` : ''}
                    ${paragraphs.length ? renderParagraphs(paragraphs) : ''}
                    ${sections.length ? `<div class="details-box">${renderSections(sections)}</div>` : ''}
                </div>
                <div class="footer">
                    <p>${safeFooterNote}</p>
                    <p>TableRise &copy; 2026. Todos os direitos reservados.</p>
                </div>
            </section>
        </div>
    </body>
</html>`;
}
