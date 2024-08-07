import path from 'path';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a profile picture is uploaded', () => {
    let user: UserInstance, filePath: any;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];

        user.inProgress = { status: 'done', code: '' };
        user.picture = null;

        filePath = path.resolve(
            __dirname,
            '../../../support/assets/test-image-batman.jpeg'
        );

        await InjectNewUser(user);
    });

    context('And all data is correct', () => {
        it('should return correct user with picture', async () => {
            const { body } = await requester()
                .post(`/users/${user.userId}/update/picture`)
                .set('Content-Type', 'multipart/form-data')
                .set('connection', 'keep-alive')
                .attach('picture', filePath)
                .expect(HttpStatusCode.OK);

            expect(body).to.have.property('createdAt');
            expect(body).to.have.property('updatedAt');
            expect(body.picture.id).to.be.equal('');
            expect(body.picture.link).to.be.equal('');
            expect(typeof body.picture.uploadDate).to.be.equal('string');
        });
    });
});
