import SystemsModel from 'src/database/models/SystemsModel';
import SystemsServices from 'src/services/SystemsServices';
import { ISystem } from 'src/schemas/systemsValidationSchema';
import { IUpdateContent } from 'src/schemas/updateContentSchema';
import mocks from 'src/support/mocks';

describe('Services :: SystemsServices', () => {
  const systemsModelMock = new SystemsModel();
  const systemsServicesMock = new SystemsServices(systemsModelMock);
  const systemMockInstance = mocks.system.instance as ISystem;

  const updateContentMockInstance = mocks.updateSystemContent.instance as IUpdateContent;

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

  describe('When service for update a system is called', () => {
    const systemMockID = systemMockInstance._id as string;
    const systemMockUpdateInstance = { ...systemMockInstance, active: false, name: 'D&D' };

    const systemMockUpdateContentInstance = {
      ...systemMockInstance,
      content: {
        ...systemMockInstance.content,
        races: []
      }
    } as unknown as ISystem;

    const { _id: _, ...systemMockPayload } = systemMockInstance;
    const { name: __, ...systemMockPayloadWrong } = systemMockPayload;

    beforeAll(() => {
      jest.spyOn(systemsModelMock, 'findOne').mockResolvedValueOnce(systemMockInstance)
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce(systemMockInstance);

      jest.spyOn(systemsModelMock, 'update').mockResolvedValue(systemMockUpdateInstance);
    });

    it('should return correct data with updated values', async () => {
      const responseTest = await systemsServicesMock.update(systemMockID, systemMockPayload);
      expect(responseTest).toBe(systemMockUpdateInstance);
    });

    it('should throw an error when payload is incorrect', async () => {
      try {
        await systemsServicesMock.update(systemMockID, systemMockPayloadWrong as ISystem);
      } catch (error) {
        const err = error as Error;
        expect(JSON.parse(err.message)[0].path[0]).toBe('name');
        expect(JSON.parse(err.message)[0].message).toBe('Required');
        expect(err.stack).toBe('422');
        expect(err.name).toBe('ValidationError');
      }
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await systemsServicesMock.update('inexistent_id', systemMockPayload);
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('Not found a system with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('Not Found');
      }
    });

    it('should throw an error when system content is modified', async () => {
      try {
        await systemsServicesMock.update(systemMockID, systemMockUpdateContentInstance);
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('Update the content directly is not allowed');
        expect(err.stack).toBe('403');
        expect(err.name).toBe('ForbiddenRequest');
      }
    });
  });

  describe('When service for update a system content is called', () => {
    const { method, newID } = updateContentMockInstance;
    const systemMockID = systemMockInstance._id as string;
    const entityMockQuery = 'races';
    const { method: __, ...updateContentWithoutMethod } = updateContentMockInstance;

    beforeAll(() => {
      jest.spyOn(systemsModelMock, 'findOne').mockResolvedValueOnce(systemMockInstance)
        .mockResolvedValue(systemMockInstance);

      jest.spyOn(systemsModelMock, 'update').mockResolvedValue(systemMockInstance);
    });

    it('should return a confirmation of add an entity ID', async () => {
      const responseTest = await systemsServicesMock.updateContent(systemMockID, entityMockQuery, updateContentMockInstance);
      expect(responseTest).toBe(`New ID ${newID} was ${method} to array of entities ${entityMockQuery}`);
    });

    it('should return a confirmation of remove an entity ID', async () => {
      const updateContentMockInstanceRemove: IUpdateContent = { method: 'remove', newID: systemMockInstance.content.races[0] };
      const { method, newID } = updateContentMockInstanceRemove;

      const responseTest = await systemsServicesMock.updateContent(systemMockID, entityMockQuery, updateContentMockInstanceRemove);
      expect(responseTest).toBe(`New ID ${newID} was ${method} to array of entities ${entityMockQuery}`);
    });

    it('should throw an error when payload is incorrect', async () => {
      try {
        await systemsServicesMock.updateContent(systemMockID, entityMockQuery, updateContentWithoutMethod as IUpdateContent);
      } catch (error) {
        const err = error as Error;
        expect(JSON.parse(err.message)[0].path[0]).toBe('method');
        expect(JSON.parse(err.message)[0].message).toBe('Required');
        expect(err.stack).toBe('422');
        expect(err.name).toBe('ValidationError');
      }
    });

    it('should throw an error when there is no entityQuery', async () => {
      try {
        await systemsServicesMock.updateContent(systemMockID, undefined as unknown as string, updateContentMockInstance);
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('An entity name is required');
        expect(err.stack).toBe('422');
        expect(err.name).toBe('ValidationError');
      }
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await systemsServicesMock.updateContent(systemMockID, entityMockQuery, updateContentMockInstance);
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('Not found a system with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('Not Found');
      }
    });
  });
});
