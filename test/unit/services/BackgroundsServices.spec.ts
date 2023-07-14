import BackgroundsModel from 'src/database/models/BackgroundsModel';
import BackgroundsServices from 'src/services/BackgroundsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Background } from 'src/schemas/backgroundsValidationSchema';
import mocks from 'src/support/mocks';

describe('Services :: BackgroundsServices', () => {
  const BackgroundsModelMock = new BackgroundsModel();
  const BackgroundsServicesMock = new BackgroundsServices(BackgroundsModelMock);
  const backgroundMockInstance = mocks.background.instance as Internacional<Background>;
  const { _id: _, ...backgroundMockPayload } = backgroundMockInstance;

  describe('When the recover all backgrounds service is called', () => {
    beforeAll(() => {
      jest.spyOn(BackgroundsModelMock, 'findAll').mockResolvedValue([backgroundMockInstance])
    });

    it('should return correct data', async () => {
      const responseTest = await BackgroundsServicesMock.findAll();
      expect(responseTest).toStrictEqual([backgroundMockInstance]);
    });
  });

  describe('When the recover a background by ID service is called', () => {
    beforeAll(() => {
      jest.spyOn(BackgroundsModelMock, 'findOne').mockResolvedValueOnce(backgroundMockInstance)
        .mockResolvedValue(null);
    });

    it('should return correct data when ID valid', async () => {
      const responseTest = await BackgroundsServicesMock.findOne(backgroundMockInstance._id as string);
      expect(responseTest).toBe(backgroundMockInstance);
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await BackgroundsServicesMock.findOne('inexistent_id');
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a background with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });

  describe('When service for update a background is called', () => {
    const backgroundMockID = backgroundMockInstance._id as string;
    const backgroundMockUpdateInstance = {
      en: { ...backgroundMockInstance.en, name: 'None' },
      pt: { ...backgroundMockInstance.pt, name: 'None' }
    };

    const { name: _1, ...backgroundMockEnWithoutName } = backgroundMockPayload.en;
    const { name: _2, ...backgroundMockPtWithoutName } = backgroundMockPayload.pt;
    const backgroundMockPayloadWrong = {
      en: backgroundMockEnWithoutName,
      pt: backgroundMockPtWithoutName
    };

    beforeAll(() => {
      jest.spyOn(BackgroundsModelMock, 'update').mockResolvedValueOnce(backgroundMockUpdateInstance)
        .mockResolvedValue(null);
    });

    it('should return correct data with updated values', async () => {
      const responseTest = await BackgroundsServicesMock.update(backgroundMockID, backgroundMockPayload as Internacional<Background>);
      expect(responseTest).toBe(backgroundMockUpdateInstance);
    });

    it('should throw an error when payload is incorrect', async () => {
      try {
        await BackgroundsServicesMock.update(backgroundMockID, backgroundMockPayloadWrong as Internacional<Background>);
      } catch (error) {
        const err = error as Error;
        expect(JSON.parse(err.message)[0].path).toStrictEqual(['en', 'name']);
        expect(JSON.parse(err.message)[0].message).toBe('Required');
        expect(err.stack).toBe('422');
        expect(err.name).toBe('ValidationError');
      }
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await BackgroundsServicesMock.update('inexistent_id', backgroundMockPayload as Internacional<Background>);
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a background with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });

  describe('When service for delete a background is called', () => {
    const backgroundMockID = backgroundMockInstance._id as string;

    beforeAll(() => {
      jest.spyOn(BackgroundsModelMock, 'findOne').mockResolvedValueOnce(backgroundMockInstance)
        .mockResolvedValue(null);

      jest.spyOn(BackgroundsModelMock, 'delete').mockResolvedValue(null);
    });

    it('should delete background and not return any data', async () => {
      try {
        await BackgroundsServicesMock.delete(backgroundMockID);
      } catch (error) {
        fail('it should not reach here')
      }
    });

    it('should throw an error when ID is inexistent', async () => {
      try {
        await BackgroundsServicesMock.delete('inexistent_id');
      } catch (error) {
        const err = error as Error;
        expect(err.message).toBe('NotFound a background with provided ID');
        expect(err.stack).toBe('404');
        expect(err.name).toBe('NotFound');
      }
    });
  });
});
