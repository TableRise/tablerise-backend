import { Request, Response } from 'express';
import sinon from 'sinon';
import UsersRoutesMiddleware from 'src/interface/users/middlewares/UsersRoutesMiddleware';

describe('Interface :: Users :: Middlewares :: UsersRoutesMiddleware', () => {
    let usersRoutesMiddleware: UsersRoutesMiddleware, routesWrapper: any;

    context('When the correct routes are wrapped in the middleware', () => {
        beforeEach(() => {
            routesWrapper = {
                routes: sinon.spy(() => ({
                    user: {
                        oAuth: (req: Request, res: Response) => {},
                        users: (req: Request, res: Response) => {},
                    },
                })),
            };

            usersRoutesMiddleware = new UsersRoutesMiddleware({
                routesWrapper,
            });
        });

        it('should return correct routes', () => {
            const routes = usersRoutesMiddleware.get();

            expect(routesWrapper.routes).to.have.been.called(2);
            expect(routes.stack).to.have.lengthOf(2);
            expect(routes.stack[0].name).to.be.equal('oAuth');
            expect(routes.stack[1].name).to.be.equal('users');
        });
    });
});
