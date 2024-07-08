import { Router } from 'express';
import UsersRoutesBuilder from 'src/interface/users/UsersRoutesBuilder';

describe('Interface :: Users :: UsersRoutesBuilder', () => {
    let usersRoutesBuilder: UsersRoutesBuilder,
        usersRoutes: any,
        oAuthRoutes: any,
        verifyUserMiddleware: any,
        verifyIdMiddleware: any;

    context('When profile routes are processed', () => {
        before(() => {
            verifyIdMiddleware = () => ({});
            verifyUserMiddleware = {
                userStatus: () => {},
            };

            usersRoutes = {
                routes: () => [
                    {
                        method: 'get',
                        path: '/users/:id/update/picture',
                        options: {
                            middlewares: [verifyIdMiddleware],
                            authentication: false,
                        },
                    },
                ],
            };

            oAuthRoutes = { routes: () => [] };

            usersRoutesBuilder = new UsersRoutesBuilder({
                usersRoutes,
                oAuthRoutes,
                verifyUserMiddleware,
            });
        });

        it('should return correct properties', () => {
            const routes = usersRoutesBuilder.get();
            expect(routes.usersRoutes).to.have.property('users');
            expect(typeof routes.usersRoutes.users).to.be.equal(typeof Router);
        });
    });

    context('When profile routes are processed - path with no user verification', () => {
        before(() => {
            verifyIdMiddleware = () => ({});
            verifyUserMiddleware = {
                userStatus: () => {},
            };

            usersRoutes = {
                routes: () => [
                    {
                        method: 'get',
                        path: '/users/:id/update',
                        options: {
                            middlewares: [verifyIdMiddleware],
                            authentication: false,
                        },
                    },
                ],
            };

            oAuthRoutes = { routes: () => [] };

            usersRoutesBuilder = new UsersRoutesBuilder({
                usersRoutes,
                oAuthRoutes,
                verifyUserMiddleware,
            });
        });

        it('should return correct properties', () => {
            const routes = usersRoutesBuilder.get();
            expect(routes.usersRoutes).to.have.property('users');
            expect(typeof routes.usersRoutes.users).to.be.equal(typeof Router);
        });
    });

    context('When oauth routes are processed', () => {
        before(() => {
            verifyIdMiddleware = () => ({});
            verifyUserMiddleware = {
                userStatus: () => {},
            };

            oAuthRoutes = {
                routes: () => [
                    {
                        method: 'get',
                        path: '/base/api',
                        options: {
                            middlewares: [verifyIdMiddleware],
                            authentication: false,
                        },
                    },
                ],
            };

            usersRoutes = { routes: () => [] };

            usersRoutesBuilder = new UsersRoutesBuilder({
                usersRoutes,
                oAuthRoutes,
                verifyUserMiddleware,
            });
        });

        it('should return correct properties', () => {
            const routes = usersRoutesBuilder.get();
            expect(routes.usersRoutes).to.have.property('oAuth');
            expect(typeof routes.usersRoutes.oAuth).to.be.equal(typeof Router);
        });
    });
});
