import { Response, Request } from "express";
import OAuthServices from "src/services/user/OAuthServices";
import logger from "@tablerise/dynamic-logger";
import OAuthControllers from "src/controllers/user/OAuthControllers";
import { HttpStatusCode } from "src/support/helpers/HttpStatusCode";

describe('Controllers :: User :: OAuthControllers', () => {
    const OAuthServicesMock = new OAuthServices(logger);
    const OAuthControllersMock = new OAuthControllers(OAuthServicesMock, logger);

    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to authenticate with google', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(OAuthServicesMock, 'google').mockResolvedValue({}); // change to user's mock when done
        });

        afterAll(() => {
            jest.clearAllMocks();
        });

        it('should return correct data in response json with status 200', async () => {
            request.user = {}
            await OAuthControllersMock.google(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.OK);
            expect(response.json).toHaveBeenCalledWith({});
        });
    })
});
