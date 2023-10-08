import { Request, Response } from 'express';
import logger from '@tablerise/dynamic-logger';
import UsersServices from 'src/services/user/UsersServices';
import UsersControllers from 'src/controllers/user/UsersControllers';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import schema from 'src/schemas';
import { RegisterUserPayload, RegisterUserResponse } from 'src/types/Response';
import { UserDetail } from 'src/schemas/user/userDetailsValidationSchema';
import { User } from 'src/schemas/user/usersValidationSchema';
import GeneralDataFaker, { UserFaker, UserDetailFaker } from '../../../support/datafakers/GeneralDataFaker';
import Database from '../../../support/Database';
import utils from '../../../support/utils';

describe('Controllers :: User :: UsersControllers', () => {
    let user: User,
        userDetails: UserDetail,
        userServices: UsersServices,
        userControllers: UsersControllers,
        userPayload: RegisterUserPayload,
        userResponse: RegisterUserResponse,
        confirmCodeResponse: any;

    const { User, UserDetails } = Database.models;
    const ValidateDataMock = new SchemaValidator();

    const request = {} as Request;
    const response = {} as Response;

    describe('When a request is made to register a new user', () => {
        beforeAll(() => {
            user = GeneralDataFaker.generateUserFaker({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;
                delete user.inProgress;

                return user;
            })[0];

            userDetails = GeneralDataFaker.generateUserDetailsFaker({} as UserDetailFaker);
            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
            userControllers = new UsersControllers(userServices, logger);

            userPayload = { ...user, details: userDetails } as RegisterUserPayload;
            userResponse = { ...user, details: userDetails } as RegisterUserResponse;

            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(userServices, 'register').mockResolvedValue(userResponse);
        });

        it('should return correct data in response json with status 201', async () => {
            request.body = userPayload;
            await userControllers.register(request, response);
            expect(response.status).toHaveBeenCalledWith(201);
            expect(response.json).toHaveBeenCalledWith(userResponse);
        });
    });

    describe('When a request is made to login', () => {
        beforeAll(() => {
            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
            userControllers = new UsersControllers(userServices, logger);

            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});
        });

        it('should return correct data in response json with status 200', async () => {
            request.user =
                'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2NTExNzNmM2EzNzVkYjE5ZmI5YjU2NDIiLCJwcm92aWRlcklkIjoiMzlkYmI1MDEtZDk3My00MzYyLTkwMDUtZmJjMzc1MGI4M2QzIiwidXNlcm5hbWUiOiJ1c2VyVG9wIzU1NDciLCJpYXQiOjE2OTU2NDI2NzMsImV4cCI6MTY5NTcyOTA3M30.ARDlaSO3Gz9c90Lu3210I-GbXtzL5T7u8uObQEQLnEM';
            await userControllers.login(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({ token: request.user });
        });
    });

    describe('When a request is made to confirm a code', () => {
        beforeAll(() => {
            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
            userControllers = new UsersControllers(userServices, logger);

            confirmCodeResponse = { status: 'done' };

            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(userServices, 'confirmCode').mockResolvedValue(confirmCodeResponse);
        });

        it('should return correct data in response json with status 201', async () => {
            request.params = { id: utils.newUUID() };
            request.query = { code: '1447ab' };
            await userControllers.confirmCode(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith(confirmCodeResponse);
        });
    });

    describe('When a request is made to verify an email', () => {
        beforeAll(() => {
            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
            userControllers = new UsersControllers(userServices, logger);

            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});
            response.end = jest.fn();

            jest.spyOn(userServices, 'emailVerify').mockResolvedValue();
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { id: '65075e05ca9f0d3b2485194f' };
            await userControllers.verifyEmail(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.end).toHaveBeenCalled();
        });
    });

    describe('When a request is made to delete a user', () => {
        beforeAll(() => {
            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
            userControllers = new UsersControllers(userServices, logger);

            response.sendStatus = jest.fn().mockReturnValue(response);

            jest.spyOn(userServices, 'delete').mockResolvedValue(undefined);
        });

        it('should return correct status 204', async () => {
            request.params = { id: '65075e05ca9f0d3b2485194f' };
            request.query = { code: '1447ab' };
            await userControllers.delete(request, response);
            expect(response.sendStatus).toHaveBeenCalledWith(204);
        });
    });
});
