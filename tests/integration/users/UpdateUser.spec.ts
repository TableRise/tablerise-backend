import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import requester from 'tests/support/requester';

describe('When the user is updated', () => {
    let userToUpdate: any;
    const userId = '12cd093b-0a8a-42fe-910f-001f2ab28454';

    context('And all data is correct', () => {
        beforeEach(() => {
            const user = DomainDataFaker.generateUsersJSON()[0];
            const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

            userToUpdate = {
                nickname: user.nickname,
                picture: user.picture,
                details: {
                    firstName: userDetails.firstName,
                    lastName: userDetails.lastName,
                    pronoun: userDetails.pronoun,
                    biography: userDetails.biography,
                    birthday: userDetails.birthday
                }
            }
        });

        it('should update with success', async () => {
            const { body: userBeforeUpdate } = await requester()
                .get(`/profile/${userId}`)
                .expect(HttpStatusCode.OK);
            
            const { body: userUpdated } = await requester()
                .put(`/profile/${userId}/update`)
                .send(userToUpdate);

            expect(userUpdated.nickname).to.not.be.equal(userBeforeUpdate.nickname);
            expect(userUpdated.picture).to.not.be.equal(userBeforeUpdate.picture);
            expect(userUpdated.details.firstName).to.not.be.equal(userBeforeUpdate.details.firstName);
            expect(userUpdated.details.lastName).to.not.be.equal(userBeforeUpdate.details.lastName);
            expect(userUpdated.details.pronoun).to.not.be.equal(userBeforeUpdate.details.pronoun);
            expect(userUpdated.details.biography).to.not.be.equal(userBeforeUpdate.details.biography);
            expect(userUpdated.details.birthday).to.not.be.equal(userBeforeUpdate.details.birthday);
        });
    });
});
