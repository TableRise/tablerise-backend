import { Router } from 'express';
import RoutesWrapper from 'src/routes/RoutesWrapper';
import Route, { RouteWrapperDeclared } from 'src/types/Route';

describe('Routes :: RoutesWrapper', () => {
    describe('When declare routes method is called', () => {
        let routesDeclared: RouteWrapperDeclared[][];

        it('should return an array with 2 arrays inside', () => {
            routesDeclared = RoutesWrapper.declareRoutes();
            expect(routesDeclared).toBeInstanceOf(Array);
            expect(routesDeclared.length).toBe(71);
        });
    });

    describe('When routes method is called', () => {
        const routesMock: Route = {
            "dungeons&dragons5e": {
                system: {} as Router,
                realms: {} as Router,
                gods: {} as Router,
                backgrounds: {} as Router,
                feats: {} as Router,
                weapons: {} as Router,
                armors: {} as Router,
                items: {} as Router,
                races: {} as Router,
                classes: {} as Router,
                magicItems: {} as Router,
                spells: {} as Router,
                wikis: {} as Router,
                monsters: {} as Router,
            }
        };

        it('should return the correct routes for dungeons&dragons5e system', () => {
            const routes = RoutesWrapper.routes();
            const routeKeys = Object.keys(routes['dungeons&dragons5e']);
            const routeMockKeys = Object.keys(routesMock['dungeons&dragons5e']);

            routeMockKeys.forEach((key, index) => {
                expect(key).toBe(routeKeys[index]);
            });
        });
    });
});
