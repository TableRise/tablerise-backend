import newUUID from 'src/domains/common/helpers/newUUID';
import JWTGenerator from 'src/domains/user/helpers/JWTGenerator';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: User :: Helpers :: JWTGenerator', () => {
    let token: string;
    const [user] = DomainDataFaker.generateUsersJSON();
    user.userId = newUUID();

    context('When a payload is provided to method', () => {
        it('should return a token', () => {
            token = JWTGenerator.generate(user);
            expect(typeof token).to.be.equal('string');
        });
    });

    context('When verify a valid token', () => {
        it('should not throw any error and return the payload', () => {
            const payload = JWTGenerator.verify(token);
            expect(payload).to.have.property('userId');
            expect(payload).to.have.property('providerId');
            expect(payload).to.have.property('username');
        });
    });

    context('When verify an invalid token', () => {
        it('should throw error but return false', () => {
            const failToken = token + '1';
            const payload = JWTGenerator.verify(failToken);
            expect(payload).to.be.equal(false);
        });
    });
});
