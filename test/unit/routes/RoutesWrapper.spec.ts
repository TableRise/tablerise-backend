import { Router } from 'express';
import RoutesWrapper, { IRoutesWrapperDeclared } from 'src/routes/RoutesWrapper';
import IRoute from 'src/types/IRoute';

describe('Routes :: RoutesWrapper', () => {
  describe('When declare routes method is called', () => {
    let routesDeclared: IRoutesWrapperDeclared[][];

    it('should return an array with 2 arrays inside', () => {
      routesDeclared = RoutesWrapper.declareRoutes();
      expect(routesDeclared).toBeInstanceOf(Array);
      expect(routesDeclared.length).toBe(2);
    });
  });

  describe('When routes method is called', () => {
    const routesMock: IRoute = {
      systems: {} as Router
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
