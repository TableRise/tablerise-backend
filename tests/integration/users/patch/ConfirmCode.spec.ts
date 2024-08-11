import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When an email code is confirmed in the user account', () => {
    let user: UserInstance;

    context('And all data is correct', () => {
        before(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];
            await InjectNewUser(user);
        });

        it('should update with success inProgress field', async () => {
            await requester()
                .patch(`/users/confirm?code=${user.inProgress.code}&email=${user.email}`)
                .expect(HttpStatusCode.NO_CONTENT);
        });
    });
});
