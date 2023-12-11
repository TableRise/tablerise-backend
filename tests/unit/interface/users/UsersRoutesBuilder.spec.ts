import { Router } from 'express';
import UsersRoutesBuilder from 'src/interface/users/UsersRoutesBuilder';

describe('Interface :: Users :: UsersRoutesBuilder', () => {
    let usersRoutesBuilder: UsersRoutesBuilder,
        usersRoutes: any,
        oAuthRoutes: any,
        verifyIdMiddleware: any;

    context('When profile routes are processed', () => {
        verifyIdMiddleware = () => ({});

        usersRoutes = {
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

        beforeEach(() => {
            oAuthRoutes = { routes: () => [] };
            usersRoutesBuilder = new UsersRoutesBuilder({ usersRoutes, oAuthRoutes });
        });

        it('should return correct properties', () => {
            const routes = usersRoutesBuilder.get();

            expect(routes.usersRoutes).to.have.property('profile');
            expect(typeof routes.usersRoutes.profile).to.be.equal(typeof Router);
        });
    });

    context('When oauth routes are processed', () => {
        verifyIdMiddleware = () => ({});

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

        beforeEach(() => {
            usersRoutes = { routes: () => [] };
            usersRoutesBuilder = new UsersRoutesBuilder({ usersRoutes, oAuthRoutes });
        });

        it('should return correct properties', () => {
            const routes = usersRoutesBuilder.get();
            expect(routes.usersRoutes).to.have.property('oAuth');
            expect(typeof routes.usersRoutes.oAuth).to.be.equal(typeof Router);
        });
    });
});
