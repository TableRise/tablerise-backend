import ConnectMongoInstance from 'src/support/helpers/ConnectMongoInstance';

describe('Support :: Helpers :: ConnectMongoInstance', () => {
  describe('When define ConnectMongoInstance', () => {
    it('should have two methods', () => {
      const classDefined = ConnectMongoInstance;
      expect(classDefined).toHaveProperty('connect');
      expect(classDefined).toHaveProperty('connectInTest');
    });
  });
});
