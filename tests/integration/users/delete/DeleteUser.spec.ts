import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an user is deleted', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.twoFactorSecret = { active: true, secret: '', qrcode: '' };
            userDetails.secretQuestion = null;

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should delete user with success', async () => {
            await requester()
                .delete(`/profile/${user.userId}/delete?token=123456`)
                .expect(HttpStatusCode.NO_CONTENT);

            await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.NOT_FOUND);
        });
    });

    context('And all data is correct - secret question', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            user.twoFactorSecret = { active: false, secret: '', qrcode: '' };

            await InjectNewUser(user);
            await InjectNewUserDetails(userDetails, user.userId);
        });

        it('should delete user with success', async () => {
            await requester()
                .delete(`/profile/${user.userId}/delete`)
                .send({
                    question: userDetails.secretQuestion?.question,
                    answer: userDetails.secretQuestion?.answer,
                })
                .expect(HttpStatusCode.NO_CONTENT);

            await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.NOT_FOUND);
        });
    });
});
