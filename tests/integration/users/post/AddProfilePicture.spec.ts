import path from 'path';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import DatabaseManagement from '@tablerise/database-management';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import requester from 'tests/support/requester';
import { DEFAULT_USER_PROFILE_PICTURE_LINK } from 'src/domains/users/helpers/UserProgression';

describe('When a profile picture is uploaded', () => {
    let user: User, filePath: any;
    const usersModel = new DatabaseManagement().modelInstance('user', 'Users');
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

    before(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        const userDetails = DomainDataFaker.generateUserDetailsJSON()[0];

        user.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusWas: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        user.picture = {
            id: '',
            link: DEFAULT_USER_PROFILE_PICTURE_LINK,
            uploadDate: new Date().toISOString(),
            title: '',
            deleteUrl: '',
            request: { success: true, status: 200 },
        } as User['picture'];

        filePath = path.resolve(__dirname, '../../../support/assets/test-image-batman.jpeg');

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    after(async () => {
        await usersModel.delete({ userId: user.userId });
        await userDetailsModel.delete({ userId: user.userId });
    });

    context('And all data is correct', () => {
        it('should return correct user with picture', async () => {
            const { body } = await requester()
                .post(`/users/${user.userId}/update/picture`)
                .attach('picture', filePath)
                .expect(HttpStatusCode.OK);

            expect(body).to.have.property('createdAt');
            expect(body).to.have.property('updatedAt');
            expect(body.picture.id).to.be.equal('stub-image-id');
            expect(body.picture.link).to.be.equal('https://img.bb/stub-image');
            expect(typeof body.picture.uploadDate).to.be.equal('string');

            const savedUserDetails = await userDetailsModel.findOne({ userId: user.userId });
            expect(savedUserDetails.xp).to.equal(100);
        });
    });
});
