import MagicItemsModel from 'src/database/models/MagicItemsModel';
import MagicItemsServices from 'src/services/MagicItemsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { MagicItem } from 'src/schemas/magicItemsValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: MagicItemsServices', () => {
    const MagicItemsModelMock = new MagicItemsModel();
    const MagicItemsServicesMock = new MagicItemsServices(MagicItemsModelMock, logger);
    const magicItemMockInstance = mocks.magicItems.instance as Internacional<MagicItem>;
    const { _id: _, ...magicItemMockPayload } = magicItemMockInstance;

    describe('When the recover all magic items service is called', () => {
        beforeAll(() => {
            jest.spyOn(MagicItemsModelMock, 'findAll').mockResolvedValue([magicItemMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await MagicItemsServicesMock.findAll();
            expect(responseTest).toStrictEqual([magicItemMockInstance]);
        });
    });

    describe('When the recover a magic item by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(MagicItemsModelMock, 'findOne')
                .mockResolvedValueOnce(magicItemMockInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await MagicItemsServicesMock.findOne(magicItemMockInstance._id as string);
            expect(responseTest).toBe(magicItemMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await MagicItemsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a magic item with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a magic item is called', () => {
        const magicItemMockID = magicItemMockInstance._id as string;
        const magicItemMockUpdateInstance = {
            en: { ...magicItemMockInstance.en, name: 'None' },
            pt: { ...magicItemMockInstance.pt, name: 'None' },
        };

        const { name: _1, ...magicItemMockEnWithoutName } = magicItemMockPayload.en;
        const { name: _2, ...magicItemMockPtWithoutName } = magicItemMockPayload.pt;
        const magicItemMockPayloadWrong = {
            en: magicItemMockEnWithoutName,
            pt: magicItemMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(MagicItemsModelMock, 'update')
                .mockResolvedValueOnce(magicItemMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await MagicItemsServicesMock.update(
                magicItemMockID,
                magicItemMockPayload as Internacional<MagicItem>
            );
            expect(responseTest).toBe(magicItemMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await MagicItemsServicesMock.update(
                    magicItemMockID,
                    magicItemMockPayloadWrong as Internacional<MagicItem>
                );
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
                await MagicItemsServicesMock.update('inexistent_id', magicItemMockPayload as Internacional<MagicItem>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a magic item with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a magic item is called', () => {
        const magicItemMockID = magicItemMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(MagicItemsModelMock, 'findOne')
                .mockResolvedValueOnce(magicItemMockInstance)
                .mockResolvedValue(null);

            jest.spyOn(MagicItemsModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete magic item and not return any data', async () => {
            try {
                await MagicItemsServicesMock.delete(magicItemMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await MagicItemsServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a magic item with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
