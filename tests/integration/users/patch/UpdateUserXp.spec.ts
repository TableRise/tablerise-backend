import supertest from 'supertest';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';
import { InjectNewUser, InjectNewUserDetails } from 'tests/support/dataInjector';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import InProgressStatusEnum from 'src/domains/users/enums/InProgressStatusEnum';
import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { container } from 'src/container';
import jwt from 'jsonwebtoken';

describe('When an authenticated user updates user xp', () => {
    let user: User, userDetails: UserDetail;

    const buildAuthenticatedCookie = (authenticatedUserId: string) =>
        `token=${jwt.sign(
            {
                userId: authenticatedUserId,
                providerId: null,
                username: 'test-user',
            },
            'secret'
        )}`;

    beforeEach(async () => {
        user = DomainDataFaker.generateUsersJSON()[0];
        userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
        userDetails.xp = 1000;
        userDetails.rank = 'bronze';
        user.inProgress = {
            status: InProgressStatusEnum.enum.DONE,
            currentFlow: stateFlowsEnum.enum.NO_CURRENT_FLOW,
            prevStatusWas: InProgressStatusEnum.enum.DONE,
            nextStatusWillBe: InProgressStatusEnum.enum.DONE,
            code: '',
        };

        await InjectNewUser(user);
        await InjectNewUserDetails(userDetails, user.userId);
    });

    afterEach(async () => {
        const DatabaseManagement = (await import('@tablerise/database-management')).default;
        const usersModel = new DatabaseManagement().modelInstance('user', 'Users');
        const userDetailsModel = new DatabaseManagement().modelInstance('user', 'UserDetails');

        await usersModel.delete({ userId: user.userId });
        await userDetailsModel.delete({ userId: user.userId });
    });

    it('should reject unauthenticated requests', async () => {
        const app = container.resolve('application').setupExpress();

        await supertest(app).patch(`/users/${user.userId}/update/xp?xp=777`).expect(HttpStatusCode.UNAUTHORIZED);
    });

    it('should validate the xp query as a positive integer', async () => {
        const app = container.resolve('application').setupExpress();

        const { body } = await supertest(app)
            .patch(`/users/${user.userId}/update/xp?xp=0`)
            .set('Cookie', buildAuthenticatedCookie(user.userId))
            .expect(HttpStatusCode.UNPROCESSABLE_ENTITY);

        expect(body.message).to.equal('Schema error');
    });

    it('should add xp, recalculate rank and level, and award the exact-match badge for the same authenticated user', async () => {
        const app = container.resolve('application').setupExpress();

        const { body } = await supertest(app)
            .patch(`/users/${user.userId}/update/xp?xp=777`)
            .set('Cookie', buildAuthenticatedCookie(user.userId))
            .expect(HttpStatusCode.OK);

        expect(body.xp).to.equal(2177);
        expect(body.level).to.be.greaterThan(1);
        expect(body.rank).to.equal('bronze');
        expect(body.gameInfo.badges).to.include('donate_normal');
    });

    it('should reject authenticated requests for another user id', async () => {
        const app = container.resolve('application').setupExpress();

        const { body } = await supertest(app)
            .patch(`/users/${user.userId}/update/xp?xp=777`)
            .set('Cookie', buildAuthenticatedCookie('12cd093b-0a8a-42fe-910f-001f2ab28454'))
            .expect(HttpStatusCode.UNAUTHORIZED);

        expect(body.message).to.equal('Unauthorized');
    });
});
