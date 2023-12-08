import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SecurePasswordHandler from 'src/domains/user/helpers/SecurePasswordHandler';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import requester from 'tests/support/requester';

describe('When the user has twoFactor activated', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = { status: 'done', code: '' };
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();

        userDetails.userId = user.userId;

        const modelUser = new DatabaseManagement().modelInstance('user', 'Users');
        const modelUserDetails = new DatabaseManagement().modelInstance(
            'user',
            'UserDetails'
        );

        await modelUser.create(user);
        await modelUserDetails.create(userDetails);
    });

    context('And all data is correct', () => {
        it('should activate with success', async () => {
            const { body: twoFactorResponse } = await requester().patch(
                `/profile/${user.userId}/2fa/activate?code=123456&isReset=false`
            );

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

            const { body: twoFactorResponse } = await requester().patch(
                `/profile/${user.userId}/2fa/activate?code=123456&isReset=true`
            );

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
