import { Router } from 'express';
import CharactersRoutesBuilder from 'src/interface/characters/CharactersRoutesBuilder';

describe('Interface :: Character :: CharactersRoutesBuilder', () => {
    let charactersRoutesBuilder: CharactersRoutesBuilder,
        charactersRoutes: any,
        verifyUserMiddleware: any,
        verifyIdMiddleware: any;

    context('#get', () => {
        beforeEach(() => {
            verifyIdMiddleware = () => ({});
            verifyUserMiddleware = {
                userStatus: () => {},
            };

            charactersRoutes = {
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

            charactersRoutesBuilder = new CharactersRoutesBuilder({
                charactersRoutes,
                verifyUserMiddleware,
            });
        });

        it('should return correct properties', () => {
            const routes = charactersRoutesBuilder.get();

            expect(routes.charactersRoutes).to.have.property('character');
            expect(typeof routes.charactersRoutes.character).to.be.equal(typeof Router);
        });
    });
});
