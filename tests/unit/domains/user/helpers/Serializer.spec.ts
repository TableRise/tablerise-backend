import Google from 'passport-google-oauth20';
import Facebook from 'passport-facebook';
import Discord from 'passport-discord';
import newUUID from 'src/domains/common/helpers/newUUID';
import Serializer from 'src/domains/user/helpers/Serializer';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: User :: Helpers :: Serializer', () => {
    let serializer: Serializer;

    context('When external user is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return with correct keys - Google', () => {
            const user = {
                id: newUUID(),
                displayName: 'test',
                _json: { email: 'test@email.com' },
                provider: 'google',
            } as Google.Profile;

            const serialized = serializer.externalUser(user);

            expect(serialized).to.have.property('name');
            expect(serialized).to.have.property('email');
            expect(serialized).to.have.property('providerId');
            expect(serialized.name).to.be.equal('test');
            expect(serialized.email).to.be.equal('test@email.com');
            expect(serialized.providerId).to.be.equal(user.id);
        });

        it('should return with correct keys - Facebook', () => {
            const user = {
                id: newUUID(),
                displayName: 'test',
                _json: { email: 'test@email.com' },
                provider: 'facebook',
            } as Facebook.Profile;

            const serialized = serializer.externalUser(user);

            expect(serialized).to.have.property('name');
            expect(serialized).to.have.property('email');
            expect(serialized).to.have.property('providerId');
            expect(serialized.name).to.be.equal('test');
            expect(serialized.email).to.be.equal('test@email.com');
            expect(serialized.providerId).to.be.equal(user.id);
        });

        it('should return with correct keys - Discord', () => {
            const user = {
                id: newUUID(),
                username: 'test',
                email: 'test@email.com',
                provider: 'discord',
            } as Discord.Profile;

            const serialized = serializer.externalUser(user);

            expect(serialized).to.have.property('name');
            expect(serialized).to.have.property('email');
            expect(serialized).to.have.property('providerId');
            expect(serialized.name).to.be.equal('test');
            expect(serialized.email).to.be.equal('test@email.com');
            expect(serialized.providerId).to.be.equal(user.id);
        });
    });

    context('When user is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return correct keys', () => {
            const userDefaultKeys = Object.keys(DomainDataFaker.generateUsersJSON()[0]);
            const user = {};
            const serialized = serializer.postUser(user);

            userDefaultKeys.forEach((key) => {
                expect(serialized).to.have.property(key);
            });
        });
    });

    context('When user details is serialized', () => {
        beforeEach(() => {
            serializer = new Serializer();
        });

        it('should return correct keys', () => {
            const userDetailsDefaultKeys = Object.keys(
                DomainDataFaker.generateUserDetailsJSON()[0]
            );
            const userDetails = {};
            const serialized = serializer.postUserDetails(userDetails);

            userDetailsDefaultKeys.forEach((key) => {
                expect(serialized).to.have.property(key);
            });
        });
    });
});
