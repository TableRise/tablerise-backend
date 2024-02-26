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
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            await requester()
                .patch(`/profile/${user.userId}/question/activate?token=123456&isUpdate=false`)
                .send(newSecretQuestion)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body: userWithSecretQuestion } = await requester()
                .get(`/profile/${user.userId}`)
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

        it('should update with success', async () => {
            const newSecretQuestion = {
                question: 'what-is-your-grandfather-last-name',
                answer: 'Silvera',
                new: {
                    question: 'what-is-your-grandfather-last-name',
                    answer: 'Marcus',
                },
            };

            const { body: userWithOldSecretQuestion } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            await requester()
                .patch(`/profile/${user.userId}/question/activate?token=123456&isUpdate=true`)
                .send(newSecretQuestion)
                .expect(HttpStatusCode.NO_CONTENT);

            const { body: userWithNewQuestion } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            expect(userWithNewQuestion.details.secretQuestion).to.be.not.null();
            expect(userWithNewQuestion.twoFactorSecret).to.be.deep.equal({
                active: false,
            });
            expect(userWithNewQuestion.details.secretQuestion.answer).to.be.equal(
                newSecretQuestion.new.answer
            );
            expect(userWithNewQuestion.details.secretQuestion.answer).to.be.not.equal(
                newSecretQuestion.answer
            );
            expect(userWithNewQuestion.details.secretQuestion.question).to.be.equal(
                newSecretQuestion.new.question
            );
            expect(userWithNewQuestion.updatedAt).to.be.not.equal(
                userWithOldSecretQuestion.updatedAt
            );
        });
    });
});
