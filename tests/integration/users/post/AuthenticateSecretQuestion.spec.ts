import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import questionEnum from 'src/domains/users/enums/questionEnum';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When user authenticates via secret question', () => {
    let user: User, userDetails: UserDetail;

    const SECRET_QUESTION = questionEnum.enum.WHAT_COLOR_DO_YOU_LIKE_THE_MOST;
    const SECRET_ANSWER = 'blue';

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusMustBe: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: 'wait-for-new-flow' as User['inProgress']['nextStatusWillBe'],
            code: '',
        };

        userDetails.secretQuestion = {
            question: SECRET_QUESTION,
            answer: SECRET_ANSWER,
        };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    context('And the secret question and answer are correct', () => {
        it('should return 200 OK with authentication locals', async () => {
            const { body } = await requester()
                .post('/users/authenticate/secret-question')
                .query({ email: user.email, flow: stateFlowsEnum.enum.UPDATE_PASSWORD })
                .send({ question: SECRET_QUESTION, answer: SECRET_ANSWER })
                .expect(HttpStatusCode.OK);

            expect(body).to.be.an('object');
            expect(body).to.have.property('userId');
            expect(body).to.have.property('userStatus');
            expect(body).to.have.property('accountSecurityMethod');
            expect(body.accountSecurityMethod).to.be.equal('secret-question');
        });
    });
});
