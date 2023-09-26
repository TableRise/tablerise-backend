import { Response, Request } from 'express';
import OAuthServices from 'src/services/user/OAuthServices';
import logger from '@tablerise/dynamic-logger';
import OAuthControllers from 'src/controllers/user/OAuthControllers';
import { HttpStatusCode } from 'src/support/helpers/HttpStatusCode';
import DatabaseManagement from '@tablerise/database-management';
import mock from 'src/support/mocks/user';
import { RegisterUserResponse } from 'src/types/Response';

describe('Controllers :: User :: OAuthControllers', () => {
    const DM = new DatabaseManagement();

    const model = DM.modelInstance('user', 'Users');
    const modelDetails = DM.modelInstance('user', 'UserDetails');
    const OAuthServicesMock = new OAuthServices(model, modelDetails, logger);
    const OAuthControllersMock = new OAuthControllers(OAuthServicesMock, logger);

    const userInstanceMock = mock.user.user;
    const userDetailsInstanceMock = mock.user.userDetails;
    userInstanceMock._id = '65075e05ca9f0d3b2485194f';
    userDetailsInstanceMock._id = '65075e05ca9f0d3b7485194f';

    const userProvidedGoogle = mock.googleProfile;
    const userProvidedFacebook = mock.facebookProfile;
    const userProvidedDiscord = mock.discordProfile;

    const userResponse = {
        ...userInstanceMock,
        details: userDetailsInstanceMock,
    };

    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to authenticate with google', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(OAuthServicesMock, 'google')
                .mockResolvedValueOnce(userResponse as RegisterUserResponse)
                .mockResolvedValue('token');
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 201', async () => {
            request.user = userProvidedGoogle;
            await OAuthControllersMock.google(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
            expect(response.json).toHaveBeenCalledWith(userResponse);
        });

        it('should return correct data in response json with status 201 - when login - return token', async () => {
            request.user = userProvidedGoogle;
            await OAuthControllersMock.google(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
            expect(response.json).toHaveBeenCalledWith({ token: 'token' });
        });
    });

    describe('When a request is made to authenticate with facebook', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(OAuthServicesMock, 'facebook').mockResolvedValue(userResponse as RegisterUserResponse);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 201', async () => {
            request.user = userProvidedFacebook;
            await OAuthControllersMock.facebook(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
            expect(response.json).toHaveBeenCalledWith(userResponse);
        });
    });

    describe('When a request is made to authenticate with discord', () => {
        beforeAll(() => {
            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(OAuthServicesMock, 'discord').mockResolvedValue(userResponse as RegisterUserResponse);
        });

        afterAll(() => jest.clearAllMocks());

        it('should return correct data in response json with status 201', async () => {
            request.user = userProvidedDiscord;
            await OAuthControllersMock.discord(request, response);

            expect(response.status).toHaveBeenCalledWith(HttpStatusCode.CREATED);
            expect(response.json).toHaveBeenCalledWith(userResponse);
        });
    });
});
