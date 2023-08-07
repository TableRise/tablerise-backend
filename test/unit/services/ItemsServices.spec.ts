import ItemsModel from 'src/database/models/ItemsModel';
import ItemsServices from 'src/services/ItemsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Item } from 'src/schemas/itemsValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ItemsServices', () => {
    const ItemsModelMock = new ItemsModel();
    const ItemsServicesMock = new ItemsServices(ItemsModelMock, logger);
    const itemMockInstance = mocks.item.instance as Internacional<Item>;
    const { _id: _, ...itemMockPayload } = itemMockInstance;

    describe('When the recover all item service is called', () => {
        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'findAll').mockResolvedValue([itemMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await ItemsServicesMock.findAll();
            expect(responseTest).toStrictEqual([itemMockInstance]);
        });
    });

    describe('When the recover all disabled items service is called', () => {
        const itemMockDisabled = { ...itemMockInstance, active: false };
        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'findAll').mockResolvedValue([itemMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await ItemsServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([itemMockDisabled]);
        });
    });

    describe('When the recover a item by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'findOne').mockResolvedValueOnce(itemMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await ItemsServicesMock.findOne(itemMockInstance._id as string);
            expect(responseTest).toBe(itemMockInstance);
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
        const itemMockID = itemMockInstance._id as string;
        const itemMockUpdateInstance = {
            en: { ...itemMockInstance.en, name: 'None' },
            pt: { ...itemMockInstance.pt, name: 'None' },
        };

        const itemMockPayloadWithoutActive = { ...itemMockPayload };
        delete itemMockPayloadWithoutActive.active;

        const { name: _1, ...itemsMockEnWithoutName } = itemMockPayload.en;
        const { name: _2, ...itemsMockPtWithoutName } = itemMockPayload.pt;
        const itemMockPayloadWrong = {
            en: itemsMockEnWithoutName,
            pt: itemsMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'update').mockResolvedValueOnce(itemMockUpdateInstance).mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await ItemsServicesMock.update(
                itemMockID,
                itemMockPayloadWithoutActive as Internacional<Item>
            );
            expect(responseTest).toBe(itemMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await ItemsServicesMock.update(itemMockID, itemMockPayloadWrong as Internacional<Item>);
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
                await ItemsServicesMock.update('inexistent_id', itemMockPayloadWithoutActive as Internacional<Item>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an item with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability race is called', () => {
        const itemMockID = itemMockInstance._id as string;
        const itemMockUpdateInstance = {
            _id: itemMockID,
            active: false,
            en: { ...itemMockInstance.en },
            pt: { ...itemMockInstance.pt },
        };

        const itemMockFindInstance = {
            _id: itemMockID,
            active: true,
            en: { ...itemMockInstance.en },
            pt: { ...itemMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Item ${itemMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Item ${itemMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(ItemsModelMock, 'findOne')
                .mockResolvedValueOnce(itemMockFindInstance)
                .mockResolvedValueOnce({ ...itemMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...itemMockFindInstance, active: true })
                .mockResolvedValueOnce(itemMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(ItemsModelMock, 'update')
                .mockResolvedValueOnce(itemMockUpdateInstance)
                .mockResolvedValueOnce({ ...itemMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await ItemsServicesMock.updateAvailability(itemMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await ItemsServicesMock.updateAvailability(itemMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the race is already enabled', async () => {
            try {
                await ItemsServicesMock.updateAvailability(itemMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already enabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the race is already disabled', async () => {
            try {
                await ItemsServicesMock.updateAvailability(itemMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already disabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ItemsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an item with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
