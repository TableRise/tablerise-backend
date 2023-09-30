import DatabaseManagement from '@tablerise/database-management';
import ItemsServices from 'src/services/dungeons&dragons5e/ItemsServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import SchemaValidator from 'src/services/helpers/SchemaValidator';
import logger from '@tablerise/dynamic-logger';
import { Item } from 'src/schemas/dungeons&dragons5e/itemsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

describe('Services :: DungeonsAndDragons5e :: ItemsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new SchemaValidator();

    const ItemsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Items');
    const ItemsServicesMock = new ItemsServices(ItemsModelMock, logger, ValidateDataMock, schema['dungeons&dragons5e']);

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

    describe('When the recover all disabled items service is called', () => {
        const itemMockDisabled = { ...itemsMockInstance, active: false };
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
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
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

        const itemMockPayloadWithoutActive = { ...itemsMockPayload };
        delete itemMockPayloadWithoutActive.active;

        const { name: _1, ...itemsMockEnWithoutName } = itemsMockPayload.en;
        const { name: _2, ...itemsMockPtWithoutName } = itemsMockPayload.pt;
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
                const err = error as HttpRequestErrors;
                expect(err.details).toHaveLength(2);
                expect(err.details[0].attribute[0]).toBe('en');
                expect(err.details[0].attribute[1]).toBe('name');
                expect(err.details[0].reason).toBe('Required');
                expect(err.code).toBe(422);
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when try to update availability', async () => {
            try {
                await ItemsServicesMock.update('inexistent_id', itemsMockPayload as Internacional<Item>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ItemsServicesMock.update('inexistent_id', itemMockPayloadWithoutActive as Internacional<Item>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability race is called', () => {
        const itemMockID = itemsMockInstance._id as string;
        const itemMockUpdateInstance = {
            _id: itemMockID,
            active: false,
            en: { ...itemsMockInstance.en },
            pt: { ...itemsMockInstance.pt },
        };

        const itemMockFindInstance = {
            _id: itemMockID,
            active: true,
            en: { ...itemsMockInstance.en },
            pt: { ...itemsMockInstance.pt },
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
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the race is already disabled', async () => {
            try {
                await ItemsServicesMock.updateAvailability(itemMockID, false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ItemsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
