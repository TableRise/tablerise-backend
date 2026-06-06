import DatabaseManagement from '@tablerise/database-management';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import requester from 'tests/support/requester';

describe('When an authenticated user registers a donation', () => {
    const authenticatedUserId = '12cd093b-0a8a-42fe-910f-001f2ab28454';
    const authenticatedUserDetailsId = 'ff2abce1-fc9e-41d7-b8ab-8cb599adb111';
    const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

    beforeEach(async () => {
        const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: authenticatedUserDetailsId });
        authenticatedUserDetails.gameInfo.badges = [];
        authenticatedUserDetails.gameInfo.donateAmount = 0;
        authenticatedUserDetails.rank = 'bronze';
        await userDetailsModel.update({ userDetailId: authenticatedUserDetailsId }, authenticatedUserDetails);
    });

    it('should send a validation email without mutating donateAmount', async () => {
        await requester()
            .post(`/users/${authenticatedUserId}/donate`)
            .query({ validation: true })
            .send({
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                nickname: 'Lia',
                userId: authenticatedUserId,
            })
            .expect(HttpStatusCode.NO_CONTENT);

        const { body } = await requester().get(`/users/${authenticatedUserId}`).expect(HttpStatusCode.OK);
        expect(body.details.gameInfo.donateAmount).to.equal(0);
        expect(body.details.gameInfo.badges).to.deep.equal([]);
    });

    it('should persist donateAmount and award the first donation badge when validation is false', async () => {
        const authenticatedUserDetails = await userDetailsModel.findOne({ userDetailId: authenticatedUserDetailsId });
        authenticatedUserDetails.gameInfo.donateAmount = 9;
        await userDetailsModel.update({ userDetailId: authenticatedUserDetailsId }, authenticatedUserDetails);

        await requester()
            .post(`/users/${authenticatedUserId}/donate`)
            .query({ validation: false })
            .send({
                value: 1,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: authenticatedUserId,
            })
            .expect(HttpStatusCode.NO_CONTENT);

        const { body } = await requester().get(`/users/${authenticatedUserId}`).expect(HttpStatusCode.OK);
        expect(body.details.gameInfo.donateAmount).to.equal(10);
        expect(body.details.gameInfo.badges).to.include('donate_normal');
    });

    it('should reject validation requests without nickname', async () => {
        const { body } = await requester()
            .post(`/users/${authenticatedUserId}/donate`)
            .query({ validation: true })
            .send({
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: authenticatedUserId,
            })
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.equal('Nickname is required when validation is true');
    });

    it('should reject requests when route id and body userId do not match', async () => {
        const { body } = await requester()
            .post(`/users/${authenticatedUserId}/donate`)
            .query({ validation: false })
            .send({
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: '00000000-0000-4000-8000-000000000001',
            })
            .expect(HttpStatusCode.BAD_REQUEST);

        expect(body.message).to.equal('Route userId and payload userId must match');
    });

    it('should reject requests for another authenticated user', async () => {
        const { body } = await requester()
            .post('/users/00000000-0000-4000-8000-000000000001/donate')
            .query({ validation: false })
            .send({
                value: 15,
                timestamp: '2026-06-03T12:30:00.000Z',
                userId: '00000000-0000-4000-8000-000000000001',
            })
            .expect(HttpStatusCode.UNAUTHORIZED);

        expect(body.message).to.equal('Unauthorized');
    });
});
