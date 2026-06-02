export const middlewareIgnore = {
    userStatus: {
        exclude: [
            '/register',
            '/login',
            '/logout',
            '/authenticate/email/send-code',
            '/authenticate/email',
            '/authenticate/2fa',
            '/update/password',
            '/:id/delete',
        ],
    },
};

export const swaggerConfig = {
    docs: {
        title: 'TableRise',
        mountPath: '/api-docs',
        outputDir: 'api-docs',
        securitySchemes: {
            cookieAuth: {
                type: 'apiKey',
                in: 'cookie',
                name: 'token',
            },
        },
    },
};

export const dndGroup = { group: 'dungeons&dragons5e' };
export const usersGroup = { group: 'users' };
export const campaignsGroup = { group: 'campaigns' };
export const charactersGroup = { group: 'characters' };
