import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';

describe('When a profile picture is uploaded', () => {
    const userId = '12cd093b-0a8a-42fe-910f-001f2ab28454';

    context('And all data is correct', () => {
        it('should return correct user with picture', async () => {
            const { body } = await requester()
                .post(`/profile/${userId}/picture`)
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
