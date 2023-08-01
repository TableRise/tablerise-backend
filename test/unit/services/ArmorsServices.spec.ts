import ArmorsModel from 'src/database/models/ArmorsModel';
import ArmorsServices from 'src/services/ArmorsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Armor } from 'src/schemas/armorsValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ArmorsServices', () => {
    const ArmorsModelMock = new ArmorsModel();
    const ArmorsServicesMock = new ArmorsServices(ArmorsModelMock, logger);
    const armorMockInstance = mocks.armor.instance as Internacional<Armor>;
    const { _id: _, ...armorMockPayload } = armorMockInstance;

    describe('When the recover all armors service is called', () => {
        beforeAll(() => {
            jest.spyOn(ArmorsModelMock, 'findAll').mockResolvedValue([armorMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await ArmorsServicesMock.findAll();
            expect(responseTest).toStrictEqual([armorMockInstance]);
        });
    });

    describe('When the recover a armor by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(ArmorsModelMock, 'findOne').mockResolvedValueOnce(armorMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await ArmorsServicesMock.findOne(armorMockInstance._id as string);
            expect(responseTest).toBe(armorMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ArmorsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an armor with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a armor is called', () => {
        const armorMockID = armorMockInstance._id as string;
        const armorMockUpdateInstance = {
            en: { ...armorMockInstance.en, name: 'None' },
            pt: { ...armorMockInstance.pt, name: 'None' },
        };

        const { name: _1, ...armorsMockEnWithoutName } = armorMockPayload.en;
        const { name: _2, ...armorsMockPtWithoutName } = armorMockPayload.pt;
        const armorMockPayloadWrong = {
            en: armorsMockEnWithoutName,
            pt: armorsMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(ArmorsModelMock, 'update')
                .mockResolvedValueOnce(armorMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await ArmorsServicesMock.update(armorMockID, armorMockPayload as Internacional<Armor>);
            expect(responseTest).toBe(armorMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await ArmorsServicesMock.update(armorMockID, armorMockPayloadWrong as Internacional<Armor>);
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
                await ArmorsServicesMock.update('inexistent_id', armorMockPayload as Internacional<Armor>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an armor with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a armor is called', () => {
        const armorMockID = armorMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(ArmorsModelMock, 'findOne').mockResolvedValueOnce(armorMockInstance).mockResolvedValue(null);

            jest.spyOn(ArmorsModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete armor and not return any data', async () => {
            try {
                await ArmorsServicesMock.delete(armorMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ArmorsServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an armor with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
