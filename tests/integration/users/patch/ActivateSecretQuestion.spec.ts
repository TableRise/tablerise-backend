import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When the user has secret question activated', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = { status: 'done', code: '' };
        user.twoFactorSecret = { active: true, qrcode: '' };
        userDetails.secretQuestion = null;

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And all data is correct', () => {
        it('should activate with success', async () => {
            const newSecretQuestion = {
                question: 'what-is-your-grandfather-last-name',
                answer: 'Silvera',
            };

            const { body: userWithoutSecretQuestion } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            await requester()
                .patch(
                    `/users/${user.userId}/question/activate?token=123456&isUpdate=false`
                )
                .send(newSecretQuestion)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body: userWithSecretQuestion } = await requester()
                .get(`/users/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(userWithSecretQuestion.details.secretQuestion).to.be.not.null();
            expect(userWithSecretQuestion.twoFactorSecret).to.be.deep.equal({
                active: false,
            });
            expect(userWithSecretQuestion.details.secretQuestion.answer).to.be.equal(
                newSecretQuestion.answer
            );
            expect(userWithSecretQuestion.details.secretQuestion.question).to.be.equal(
                newSecretQuestion.question
            );
            expect(userWithSecretQuestion.updatedAt).to.be.not.equal(
                userWithoutSecretQuestion.updatedAt
            );
        });
    });
});
