import sinon from 'sinon';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import EmailSender from 'src/infra/helpers/user/EmailSender';
import requester from 'tests/support/requester';

describe('When a user is created', () => {
    let user: UserInstance, details: UserDetailInstance;

    context('And all data is correct', () => {
        beforeEach(() => {
            user = DomainDataFaker.generateUsersJSON()[0];
            details = DomainDataFaker.generateUserDetailsJSON()[0];

            sinon.stub(EmailSender.prototype, 'send').resolves({ success: true, verificationCode: 'LOKI74' })
        });

        it('should return correct user created with details', async () => {
            details.role = 'user';

            const payload = {
                ...user,
                details
            };

            const { body } = await requester()
                .post('/profile/register')
                .send(payload)
                .expect(HttpStatusCode.CREATED);

            expect(body).to.have.property('createdAt');
            expect(body).to.have.property('updatedAt');
            expect(body).to.have.property('inProgress');
            expect(body.inProgress).to.have.property('status').that.is.equal('wait_to_confirm');

            expect(body).to.have.property('details');
            expect(body.details).to.have.property('userId');
            expect(body.details).to.have.property('role').that.is.equal('user');
        });
    });
});
