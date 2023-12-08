import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import SecurePasswordHandler from 'src/domains/user/helpers/SecurePasswordHandler';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import requester from 'tests/support/requester';

describe('When a profile picture is uploaded', () => {
    let user: UserInstance;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];

        user.password = await SecurePasswordHandler.hashPassword(user.password);
        user.inProgress = { status: 'done', code: '' };
        user.createdAt = new Date().toISOString();
        user.updatedAt = new Date().toISOString();

        user.picture = null;

        const model = new DatabaseManagement().modelInstance('user', 'Users');
        await model.create(user);
    });

    context('And all data is correct', () => {
        it('should return correct user with picture', async () => {
            const { body } = await requester()
                .post(`/profile/${user.userId}/picture`)
                .set('Content-Type', 'multipart/form-data')
                .attach('image', './tests/support/assets/test-image-batman.jpeg')
                .expect(HttpStatusCode.OK);

            expect(body).to.have.property('createdAt');
            expect(body).to.have.property('updatedAt');
            expect(body.picture.id).to.be.equal('');
            expect(body.picture.link).to.be.equal('');
            expect(typeof body.picture.uploadDate).to.be.equal('string');
        });
    });
});
