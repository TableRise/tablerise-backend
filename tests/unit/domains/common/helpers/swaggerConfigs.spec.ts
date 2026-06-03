import {
    campaignsGroup,
    charactersGroup,
    dndGroup,
    middlewareIgnore,
    swaggerConfig,
    usersGroup,
} from 'src/domains/common/helpers/swaggerConfigs';

describe('Domains :: Common :: Helpers :: swaggerConfigs', () => {
    it('should expose the ignored auth routes and swagger metadata', () => {
        expect(middlewareIgnore.userStatus.exclude).to.deep.equal([
            '/register',
            '/login',
            '/logout',
            '/authenticate/email/send-code',
            '/authenticate/email',
            '/authenticate/2fa',
            '/update/password',
            '/:id/delete',
        ]);

        expect(swaggerConfig).to.deep.equal({
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
        });
    });

    it('should expose the expected swagger groups', () => {
        expect(dndGroup).to.deep.equal({ group: 'dungeons&dragons5e' });
        expect(usersGroup).to.deep.equal({ group: 'users' });
        expect(campaignsGroup).to.deep.equal({ group: 'campaigns' });
        expect(charactersGroup).to.deep.equal({ group: 'characters' });
    });
});
