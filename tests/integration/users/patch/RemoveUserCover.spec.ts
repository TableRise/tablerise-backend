import DatabaseManagement from '@tablerise/database-management';
import path from 'path';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';

describe('When a user details cover is removed', () => {
    const userId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    const userDetailId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';
    const anotherUserId = '11111111-1111-4111-8111-111111111111';
    const filePath = path.resolve(__dirname, '../../../support/assets/test-image-batman.jpeg');
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

    beforeEach(async () => {
        await userDetailsModel.delete({ userId });
        await userDetailsModel.create({
            userDetailId,
            userId,
            firstName: 'Joe',
            lastName: 'Einstein',
            birthday: '1995-10-25',
            gameInfo: {
                campaigns: [],
                characters: [],
                badges: [],
                campaignsJoinedAmount: 0,
                campaignsCreatedAmount: 0,
                campaignsClosedAmount: 0,
                equipBoughtAmount: 0,
                donateAmount: 0,
            },
            biography: 'Some bio',
            role: 'admin',
            cover: null,
        });
    });

    it('should reset the cover to null', async () => {
        await requester()
            .patch(`/users/${userId}/update/cover`)
            .attach('image', filePath)
            .expect(HttpStatusCode.NO_CONTENT);

        await requester().patch(`/users/${userId}/update/cover/remove`).expect(HttpStatusCode.NO_CONTENT);

        const savedUserDetails = await userDetailsModel.findOne({ userDetailId });

        expect(savedUserDetails.cover).to.equal(null);
    });

    it('should reject removal for another authenticated user id', async () => {
        await requester().patch(`/users/${anotherUserId}/update/cover/remove`).expect(HttpStatusCode.UNAUTHORIZED);
    });
});
