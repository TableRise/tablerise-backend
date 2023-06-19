import SystemsModel from 'src/database/models/SystemsModel';
import SystemsServices from 'src/services/SystemsServices';
import { ISystem } from 'src/schemas/systemsValidationSchema';
import mocks from 'src/support/schemas';

describe('Services :: SystemsServices', () => {
  const systemsModelMock = new SystemsModel();
  const systemsServicesMock = new SystemsServices(systemsModelMock);
  const systemMockInstance = mocks.system.instance as ISystem;

  describe('When the recover all system service is called', () => {
    beforeAll(() => {
      jest.spyOn(systemsModelMock, 'findAll').mockResolvedValue([systemMockInstance])
    });

    it('should return correct data', async () => {
      const responseTest = await systemsServicesMock.findAll();
      expect(responseTest).toStrictEqual([systemMockInstance]);
    });
  });

  describe('When the recover a system by ID service is called', () => {
    beforeAll(() => {
      jest.spyOn(systemsModelMock, 'findOne').mockResolvedValueOnce(systemMockInstance)
        .mockResolvedValue(null);
    });

    it('should return correct data when ID valid', async () => {
      const responseTest = await systemsServicesMock.findOne(systemMockInstance._id as string);
      expect(responseTest).toBe(systemMockInstance);
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await systemsServicesMock.findOne('inexistent_id');
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('Not found a system with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('Not Found');
      }
    });
  });
});
