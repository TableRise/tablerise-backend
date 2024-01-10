import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import requester from 'tests/support/requester';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { InjectNewUser } from 'tests/support/dataInjector';

describe('When the user is logged in', () => {
    let user: UserInstance;

    context('And the credentials are valid', () => {
        beforeEach(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];

            user.inProgress = { status: 'done', code: '' };

            await InjectNewUser(user);
        });

        it('should do successfull login', async () => {
            const login = {
                email: user.email,
                password: 'TheWorld@122',
            };

            await requester()
                .post('/profile/login')
                .send(login)
                .expect(HttpStatusCode.NO_CONTENT);
        });
    });
});
