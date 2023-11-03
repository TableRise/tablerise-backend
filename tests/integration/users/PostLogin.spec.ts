import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import requester from 'tests/support/requester';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import DatabaseManagement from '@tablerise/database-management';
import SecurePasswordHandler from 'src/infra/helpers/user/SecurePasswordHandler';

describe('When the user is logged in', () => {
    let user: UserInstance;

    context('And the credentials are valid', () => {
        beforeEach(async () => {
            user = DomainDataFaker.generateUsersJSON()[0];

            user.password = await SecurePasswordHandler.hashPassword(user.password);
            user.inProgress = { status: 'done', code: '' };
            user.createdAt = new Date().toISOString();
            user.updatedAt = new Date().toISOString();

            const model = new DatabaseManagement().modelInstance('user', 'Users');
            await model.create(user);
        });

        it('should return a correct token', async () => {
            const login = {
                email: user.email,
                password: 'TheWorld@122'
            };

            const { body } = await requester()
                .post('/profile/login')
                .send(login)
                .expect(HttpStatusCode.OK);

            expect(body).to.have.property('token');
            expect(body.token).to.be.a('string');
        });
    })
});
