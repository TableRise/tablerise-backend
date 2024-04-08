import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user has twoFactor activated', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = { status: 'done', code: '' };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        it('should activate with success', async () => {
            const { body: twoFactorResponse } = await requester()
                .patch(`/profile/${user.userId}/2fa/activate?code=123456&isReset=false`)
                .send({
                    question: userDetails.secretQuestion?.question,
                    answer: userDetails.secretQuestion?.answer,
                });

            expect(twoFactorResponse).to.have.property('qrcode');
            expect(twoFactorResponse).to.have.property('active');
            expect(twoFactorResponse).to.have.not.property('secret');
            expect(typeof twoFactorResponse.qrcode).to.be.equal('string');
            expect(twoFactorResponse.active).to.be.equal(true);
        });

        it('should update with success', async () => {
            const { body: userWithOldTwoFactor } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            const { body: twoFactorResponse } = await requester()
                .patch(`/profile/${user.userId}/2fa/activate?code=123456&isReset=true`)
                .send({
                    question: userDetails.secretQuestion?.question,
                    answer: userDetails.secretQuestion?.answer,
                });

            expect(twoFactorResponse).to.have.property('qrcode');
            expect(twoFactorResponse).to.have.property('active');
            expect(twoFactorResponse).to.have.not.property('secret');
            expect(typeof twoFactorResponse.qrcode).to.be.equal('string');
            expect(twoFactorResponse.qrcode).to.be.not.equal(
                userWithOldTwoFactor.twoFactorSecret.qrcode
            );
            expect(twoFactorResponse.active).to.be.equal(true);
        });
    });
});
