export default (verifyCode: string, usernameUser: string): string => `<!DOCTYPE html>
<html>
    <head>
        <style>
            .gray-bg {
                background-color: rgb(214, 214, 214);
                width: 100%;
            }

            body {
                padding: 0;
                margin: 0;
            }

            .confirm-section {
                background-color: white;
                width: 50%;
                text-align: center;
                margin: auto;
                text-align: center;
            }


            .img-bg {
                background: url('https://i.ibb.co/BZJ7LZG/tablerise-cover-fit.webp');
                background-size: cover;
                background-position: center;
                width: 100%;
                height: 15rem;
            }
    
            .verify-code {
                font-size: 2.5rem;
                font-weight: 600;
            }
    
            .goblin-warn {
                display: flex;
                font-weight: 700;
                font-size: 1.1rem;
                width: fit-content;
                margin: auto;
                text-align: center;
            }
    
            .goblin-warn img {
                width: 5rem;
            }
    
            .header-content {
                display: flex;
                font-size: 1.1rem;
                width: fit-content;
                margin: auto;
                text-align: center;
            }
    
            .header-content img {
                width: 5rem;
            }

            footer {
                background-color: #141842;
                width: 100%;
                padding: 1rem 0 1rem 0;
                color: white;
            }

            @media (max-width: 640px) {
                .confirm-section {
                    width: 100%;
                }

                .goblin-warn {
                    font-size: 1rem;
                }

                .header-content {
                    font-size: 1rem;
                }

                .verify-code {
                    font-size: 1.5rem;
                }
            }
        </style>
    </head>
    <body>
        <div class="gray-bg">
            <section class="confirm-section">
                <header>
                    <h1>Seja bem vindo(a) ao TableRise</h1>
                    <div class="img-bg"></div>
                    <h2>Precisamos confirmar sua identidade!</h2>
                    <div class="goblin-warn">
                        <span align="left">Afinal vai que você é um <br />goblin mal intencionado querendo roubar nosso ouro?</span>
                        <img src="https://i.ibb.co/jMtpSV4/pngegg.png" alt="bad-goblin">
                    </div>
                    <br />
                    <br />
                </header>
                <div>
                    <div class="header-content">
                        <img src="https://i.ibb.co/4pWLymg/327-3271131-mage-rpg-mage-class-1.png" alt="mage-woman">
                        <p align="right">
                            Este email tem o uso excluivo de enviar emails de comunicação<br />
                            Para obter suporte, por favor, entre em contato no endereço abaixo:<br />
                            tablerise@outlook.com
                        </p>
                    </div>
                    <br />
                    <p>Faça login no TableRise e utilize o código abaixo para confirmar sua conta</p>
                    <p>Usuário: ${usernameUser}</p>
                    <span class="verify-code">${verifyCode}</span>
                    <br />
                    <br />
                </div>
                <footer>
                    <span>Todos os direitos reservados © TableRise 2023</span>
                </footer>
            </section>
        </div>
    </body>
</html>`