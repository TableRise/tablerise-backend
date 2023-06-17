import RoutesWrapper from 'src/routes/RoutesWrapper';

describe('Routes :: RoutesWrapper', () => {
  describe('When declare routes method is called', () => {
    let routesDeclared: Array<[]>;

    it('should return an array with 0 arrays inside', () => {
      routesDeclared = RoutesWrapper.declareRoutes();
      expect(routesDeclared).toBeInstanceOf(Array);
      expect(routesDeclared.length).toBe(0);
    });
  })
});
