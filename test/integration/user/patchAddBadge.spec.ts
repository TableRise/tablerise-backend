import logger from "@tablerise/dynamic-logger";
import mock from "src/support/mocks/user";
import { HttpStatusCode } from "src/services/helpers/HttpStatusCode";
import generateNewMongoID from "src/support/helpers/generateNewMongoID";
import DatabaseManagement, { mongoose } from "@tablerise/database-management";
import requester from "../../support/requester";

describe('Add user badges', () => {
    const userDetailsInstanceMock = mock.user.userDetails;

    beforeAll(() => {
        DatabaseManagement.connect(true)
            .then(() => {
                logger('info', 'Test database connection instanciated');
            })
            .catch(() => {
                logger('error', 'Test database connection failed');
            });
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('When request to add user badge', () => {
        it('should return correct status', async () => {
            const badgeId = generateNewMongoID();
            userDetailsInstanceMock._id = generateNewMongoID();
            userDetailsInstanceMock.userId = generateNewMongoID();

            const testUser = await new DatabaseManagement().modelInstance('user', 'UserDetails').create(userDetailsInstanceMock);

            await requester.patch(`/profile/${testUser.userId as string}/update/badges?id=${badgeId}`)
                .expect(HttpStatusCode.OK);
        })
    })
});