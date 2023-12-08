import sinon from 'sinon';
import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SecurePasswordHandler from 'src/domains/user/helpers/SecurePasswordHandler';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import requester from 'tests/support/requester';
import AuthorizationMiddleware from 'src/interface/users/middlewares/AuthorizationMiddleware';

describe('When the user has secret question activated', () => {
    let user: UserInstance, userDetails: UserDetailInstance;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = { status: 'done', code: '' };
        user.twoFactorSecret = { active: true, qrcode: '' };
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();

        userDetails.userId = user.userId;
        userDetails.secretQuestion = null;

        const modelUser = new DatabaseManagement().modelInstance('user', 'Users');
        const modelUserDetails = new DatabaseManagement().modelInstance(
            'user',
            'UserDetails'
        );

        await modelUser.create(user);
        await modelUserDetails.create(userDetails);
    });

    context('And all data is correct', () => {
        before(() => {
            sinon
                .stub(AuthorizationMiddleware.prototype, 'twoFactor')
                .callsFake(async (_req, _res, next): Promise<void> => {
                    next();
                });
        });

        it('should activate with success', async () => {
            const newSecretQuestion = {
                question: 'what-is-your-grandfather-last-name',
                answer: 'Silvera',
            };

            const { body: userWithoutSecretQuestion } = await requester()
                .get(`/profile/${user.userId}`)
                .expect(HttpStatusCode.OK);

            await requester()
                .patch(
                    `/profile/${user.userId}/question/activate?token=123456&isUpdate=false`
                )
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
                .patch(
                    `/profile/${user.userId}/question/activate?token=123456&isUpdate=true`
                )
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
