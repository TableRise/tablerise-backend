import bindUserStatusMiddleware from 'src/domains/common/helpers/bindUserStatusMiddleware';

describe('Domains :: :: Common :: Helpers :: bindUserStatusMiddleware', () => {
    context('When a middleware is binded to routes', () => {
        let routes = [] as any;
        const middleware = (): void => {};

        beforeEach(() => {
            routes = [];
            routes.push({
                method: 'get',
                path: '/base/api',
                options: {
                    middlewares: [],
                    authentication: false,
                },
            });
        });

        it('should bind correctly - push', () => {
            const routesBinded = bindUserStatusMiddleware(middleware, routes, { substringLoc: 3 });

            expect(routesBinded[0].options).to.have.property('middlewares');
            expect(routesBinded[0].options.middlewares).to.be.an('array');
            expect(routesBinded[0].options.middlewares).to.have.lengthOf(1);
        });

        it('should bind correctly - with ignore', () => {
            const routesBinded = bindUserStatusMiddleware(middleware, routes, {
                substringLoc: 5,
                pathsToIgnore: ['/api'],
            });

            expect(routesBinded[0].options.middlewares).to.have.lengthOf(0);
        });

        it('should bind correctly - unshift', () => {
            const routesBinded = bindUserStatusMiddleware(middleware, routes, {
                substringLoc: 3,
                addMethod: 'unshift',
            });

            expect(routesBinded[0].options).to.have.property('middlewares');
            expect(routesBinded[0].options.middlewares).to.be.an('array');
            expect(routesBinded[0].options.middlewares).to.have.lengthOf(1);
        });

        it('should bind correctly - no-options', () => {
            const routesBinded = bindUserStatusMiddleware(middleware, routes);

            expect(routesBinded[0].options).to.have.property('middlewares');
            expect(routesBinded[0].options.middlewares).to.be.an('array');
            expect(routesBinded[0].options.middlewares).to.have.lengthOf(1);
        });
    });
});
