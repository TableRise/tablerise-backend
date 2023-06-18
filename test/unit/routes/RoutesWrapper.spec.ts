import RoutesWrapper, { IRoutesWrapperDeclared } from 'src/routes/RoutesWrapper';

describe('Routes :: RoutesWrapper', () => {
  describe('When declare routes method is called', () => {
    let routesDeclared: IRoutesWrapperDeclared[][];

    it('should return an array with 2 arrays inside', () => {
      routesDeclared = RoutesWrapper.declareRoutes();
      expect(routesDeclared).toBeInstanceOf(Array);
      expect(routesDeclared.length).toBe(2);
    });
  })
});
