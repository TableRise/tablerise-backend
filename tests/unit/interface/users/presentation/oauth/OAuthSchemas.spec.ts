import OAuthSchemas from 'src/interface/users/presentation/oauth/OAuthSchemas';

describe('Interface :: Users :: Presentation :: Oauth :: OAuthSchemas', () => {
    context('When the schemas factory is called', () => {
        it('should return object with all expected schema keys', () => {
            const schemas = OAuthSchemas();

            expect(schemas).to.have.property('postCompleteOauthRegister');
        });
    });
});
