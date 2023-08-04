import ItemsModel from 'src/database/models/ItemsModel';
import ItemsServices from 'src/services/ItemsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item } from 'src/schemas/itemsValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ItemsServices', () => {
    const ItemsModelMock = new ItemsModel();
    const ItemsServicesMock = new ItemsServices(ItemsModelMock, logger);
    const itemsMockInstance = mocks.item.instance as Internacional<Item>;
    const { _id: _, ...itemsMockPayload } = itemsMockInstance;

    describe('When the recover all item service is called', () => {
        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'findAll').mockResolvedValue([itemsMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await ItemsServicesMock.findAll();
            expect(responseTest).toStrictEqual([itemsMockInstance]);
        });
    });

    describe('When the recover a item by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'findOne').mockResolvedValueOnce(itemsMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await ItemsServicesMock.findOne(itemsMockInstance._id as string);
            expect(responseTest).toBe(itemsMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ItemsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an item with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a item is called', () => {
        const itemMockID = itemsMockInstance._id as string;
        const itemMockUpdateInstance = {
            en: { ...itemsMockInstance.en, name: 'None' },
            pt: { ...itemsMockInstance.pt, name: 'None' },
        };

        const { name: _1, ...itemsMockEnWithoutName } = itemsMockPayload.en;
        const { name: _2, ...itemsMockPtWithoutName } = itemsMockPayload.pt;
        const itemsMockPayloadWrong = {
            en: itemsMockEnWithoutName,
            pt: itemsMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'update')
                .mockResolvedValueOnce(itemMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await ItemsServicesMock.update(
                itemMockID,
                itemsMockPayload as Internacional<Item>
            );
            expect(responseTest).toBe(itemMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await ItemsServicesMock.update(itemMockID, itemsMockPayloadWrong as Internacional<Item>);
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
                await ItemsServicesMock.update('inexistent_id', itemsMockPayload as Internacional<Item>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an item with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a item is called', () => {
        const itemMockID = itemsMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'findOne').mockResolvedValueOnce(itemsMockInstance).mockResolvedValue(null);

            jest.spyOn(ItemsModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete item and not return any data', async () => {
            try {
                await ItemsServicesMock.delete(itemMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ItemsServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an item with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
