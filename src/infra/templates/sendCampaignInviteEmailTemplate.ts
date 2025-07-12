export default (campaignId: string, userId: string, username: string): string => `<!DOCTYPE html>
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
                font-family: sans-serif;
            }

            .confirm-section {
                background-color: white;
                width: 50%;
                text-align: center;
                margin: auto;
                text-align: center;
            }


            .img-bg {
                background: url('https://images.ctfassets.net/swt2dsco9mfe/16ZyURdjanpyLYYmLjdIS7/bee7815a702835902ac10f7fa326aee4/Strixhaven_1280x960_Wallpaper.jpg?q=70&fit=thumb&w=1280&h=960&fm=avif');
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
                font-weight: 500;
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
                font-size: 0.9rem;
                width: fit-content;
                margin: auto;
                text-align: center;
            }
    
            .header-content img {
                width: 5rem;
            }

            footer {
                background-color: #241538;
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
                    <div class="img-bg"></div>
                    <h2>TableRise - Convite para Campanha</h2>
                    <div class="goblin-warn">
                        <span align="center">Você foi convocado(a) aventureiro(a)<br />um novo Reino precisa de você para construir uma nova história!<br />Vai aceitar o desafio?</span>
                    </div>
                    <br />
                </header>
                <div>
                    <div class="header-content">
                        <p align="center">
                            Este endereço tem o uso excluivo de enviar emails de comunicação<br />
                            Para obter suporte, por favor, entre em contato no endereço abaixo:<br />
                            tablerise@outlook.com
                        </p>
                    </div>
                    <p>Utilize o link abaixo para entrar na campanha</p>
                    <p>Usuário: ${username}</p>
                    <span class="verify-code">https://tablerise.com/campaigns/${campaignId}?player=${userId}</span>
                    <br />
                    <br />
                </div>
                <footer>
                    <span>Todos os direitos reservados © TableRise 2023</span>
                </footer>
            </section>
        </div>
    </body>
</html>`;
