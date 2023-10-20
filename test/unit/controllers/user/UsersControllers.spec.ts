import { Request, Response } from 'express';
import logger from '@tablerise/dynamic-logger';
import UsersServices from 'src/services/user/UsersServices';
import UsersControllers from 'src/controllers/user/UsersControllers';
import SchemaValidator from 'src/infra/helpers/SchemaValidator';
import schema from 'src/schemas';
import { RegisterUserPayload, RegisterUserResponse } from 'src/types/Response';
import { UserDetail } from 'src/interface/users/schemas/userDetailsValidationSchema';
import { User } from 'src/interface/users/schemas/usersValidationSchema';
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
            user = GeneralDataFaker.generateUserJSON({} as UserFaker).map((user) => {
                delete user._id;
                delete user.tag;
                delete user.providerId;
                delete user.inProgress;

                return user;
            })[0];

            userDetails = GeneralDataFaker.generateUserDetailJSON({} as UserDetailFaker).map((detail) => {
                delete detail._id;
                delete detail.userId;

                return detail;
            })[0];

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

    describe('When a request is made to activate 2FA', () => {
        beforeAll(() => {
            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
            userControllers = new UsersControllers(userServices, logger);

            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(userServices, 'activateTwoFactor').mockResolvedValue({ qrcode: '', active: true });
        });

        it('should return correct data in response json with status 200', async () => {
            request.params = { id: '65075e05ca9f0d3b2485194f' };
            await userControllers.activateTwoFactor(request, response);
            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({ qrcode: '', active: true });
        });
    });

    describe('When a request is made to update an email', () => {
        beforeAll(() => {
            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
            userControllers = new UsersControllers(userServices, logger);

            response.sendStatus = jest.fn().mockReturnValue(response);

            jest.spyOn(userServices, 'updateEmail').mockResolvedValue(undefined);
        });

        it('should return correct status 204', async () => {
            request.params = { id: utils.newUUID() };
            request.query = { code: 'IQSMPW' };
            request.body = { email: 'new-email@email.com' };
            await userControllers.updateEmail(request, response);
            expect(response.sendStatus).toHaveBeenCalledWith(204);
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
            await userControllers.delete(request, response);
            expect(response.sendStatus).toHaveBeenCalledWith(204);
        });
    });

    describe('When a request is made to reset the 2FA', () => {
        beforeAll(() => {
            userServices = new UsersServices(User, UserDetails, logger, ValidateDataMock, schema.user);
            userControllers = new UsersControllers(userServices, logger);

            response.status = jest.fn().mockReturnValue(response);
            response.json = jest.fn().mockReturnValue({});

            jest.spyOn(userServices, 'resetTwoFactor').mockResolvedValue({
                qrcode: '',
                active: true,
            });
        });

        it('should return correct status 200 with correct response', async () => {
            request.params = { id: '65075e05ca9f0d3b2485194f' };
            await userControllers.resetTwoFactor(request, response);

            expect(response.status).toHaveBeenCalledWith(200);
            expect(response.json).toHaveBeenCalledWith({
                qrcode: '',
                active: true,
            });
        });
    });
});
