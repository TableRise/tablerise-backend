import { Request, Response } from 'express';
import sinon from 'sinon';
import CharactersRoutesMiddleware from 'src/interface/characters/middlewares/CharactersRoutesMiddleware';

describe('Interface :: Campaigns :: Middlewares :: CharactersRoutesMiddleware', () => {
    let charactersRoutesMiddleware: CharactersRoutesMiddleware, routesWrapper: any;

    context('When the correct routes are wrapped in the middleware', () => {
        beforeEach(() => {
            routesWrapper = {
                routes: sinon.spy(() => ({
                    character: {
                        character: (req: Request, res: Response) => {},
                    },
                })),
            };

            charactersRoutesMiddleware = new CharactersRoutesMiddleware({
                routesWrapper,
            });
        });

        it('should return correct routes', () => {
            const routes = charactersRoutesMiddleware.get();

            expect(routesWrapper.routes).to.have.been.called(1);
            expect(routes.stack).to.have.lengthOf(1);
            expect(routes.stack[0].name).to.be.equal('character');
        });
    });
});
