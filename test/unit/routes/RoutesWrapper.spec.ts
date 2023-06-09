import { Router } from 'express';
import RoutesWrapper from 'src/routes/RoutesWrapper';
import Route, { RouteWrapperDeclared } from 'src/types/Route';

describe('Routes :: RoutesWrapper', () => {
  describe('When declare routes method is called', () => {
    let routesDeclared: RouteWrapperDeclared[][];

    it('should return an array with 2 arrays inside', () => {
      routesDeclared = RoutesWrapper.declareRoutes();
      expect(routesDeclared).toBeInstanceOf(Array);
      expect(routesDeclared.length).toBe(14);
    });
  });

  describe('When routes method is called', () => {
    const routesMock: Route = {
      system: {} as Router,
      realms: {} as Router,
      gods: {} as Router
    };

    it('should return the correct routes', () => {
      const routes = RoutesWrapper.routes();
      const routeKeys = Object.keys(routes);
      const routeMockKeys = Object.keys(routesMock);

      routeMockKeys.forEach((key, index) => {
        expect(key).toBe(routeKeys[index]);
      })
    });
  });
});
