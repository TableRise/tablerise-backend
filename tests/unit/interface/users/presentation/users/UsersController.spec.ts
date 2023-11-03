/* eslint-disable @typescript-eslint/no-unused-expressions */
import { Request, Response } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import UsersController from 'src/interface/users/presentation/users/UsersController';

describe('Interface :: Users :: Presentation :: Users :: UsersController', () => {
    context('#register', () => {
        let usersController: UsersController,
        createUserOperation: any;

        const request = {} as Request;
        const response = {} as Response;

        beforeEach(() => {
            response.status = sinon.spy(() => response);
            response.json = sinon.spy(() => response);

            createUserOperation = { execute: () => ({}) };

            usersController = new UsersController({ createUserOperation });
        });

        it('should correctly call the methods and functions', async () => {
            await usersController.register(request, response);

            expect(response.status).to.have.been.calledWith(HttpStatusCode.CREATED);
            expect(response.json).to.have.been.called();
        });
    });
});
