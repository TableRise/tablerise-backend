import fs from 'fs';
import path from 'path';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';

describe('When a profile picture is uploaded', () => {
    let user: UserInstance, file: any;

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];

        user.inProgress = { status: 'done', code: '' };
        user.picture = null;

        await InjectNewUser(user);

        file = fs.createReadStream(
            path.join(process.cwd(), '/tests/support/assets/test-image-batman.jpeg')
        );
    });

    context('And all data is correct', () => {
        it('should return correct user with picture', async () => {
            setTimeout(async () => {
                const { body } = await requester()
                    .post(`/profile/${user.userId}/update/picture`)
                    .set('Content-Type', 'multipart/form-data')
                    .attach('image', file)
                    .expect(HttpStatusCode.OK);

                expect(body).to.have.property('createdAt');
                expect(body).to.have.property('updatedAt');
                expect(body.picture.id).to.be.equal('');
                expect(body.picture.link).to.be.equal('');
                expect(typeof body.picture.uploadDate).to.be.equal('string');
            });
        });
    });
});
