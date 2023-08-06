import ArmorsModel from 'src/database/models/ArmorsModel';
import ArmorsServices from 'src/services/ArmorsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Armor } from 'src/schemas/armorsValidationSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ArmorsServices', () => {
    const ArmorsModelMock = new ArmorsModel();
    const ValidateDataMock = new ValidateData(logger);
    const ArmorsServicesMock = new ArmorsServices(ArmorsModelMock, logger, ValidateDataMock );
    const armorMockInstance = mocks.armor.instance as Internacional<Armor>;
    const { _id: _, ...armorMockPayload } = armorMockInstance;

    describe('When the recover all enabled armors service is called', () => {
        beforeAll(() => {
            jest.spyOn(ArmorsModelMock, 'findAll').mockResolvedValue([armorMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await ArmorsServicesMock.findAll();
            expect(responseTest).toStrictEqual([armorMockInstance]);
        });
    });

    describe('When the recover all disabled armors service is called', () => {
        const armorMockDisabled = { ...armorMockInstance, active: false };
        beforeAll(() => {
            jest.spyOn(ArmorsModelMock, 'findAll').mockResolvedValue([armorMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await ArmorsServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([armorMockDisabled]);
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
        const armorMockPayloadWithoutActive = { ...armorMockPayload };
        delete armorMockPayloadWithoutActive.active;

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
            const responseTest = await ArmorsServicesMock.update(
                armorMockID,
                armorMockPayloadWithoutActive as Internacional<Armor>
            );
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

        it('should throw an error when try to update availability', async () => {
            try {
                await ArmorsServicesMock.update('inexistent_id', armorMockPayload as Internacional<Armor>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ArmorsServicesMock.update('inexistent_id', armorMockPayloadWithoutActive as Internacional<Armor>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an armor with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability armor is called', () => {
        const armorMockID = armorMockInstance._id as string;
        const armorMockUpdateInstance = {
            _id: armorMockID,
            active: false,
            en: { ...armorMockInstance.en },
            pt: { ...armorMockInstance.pt },
        };

        const armorMockFindInstance = {
            _id: armorMockID,
            active: true,
            en: { ...armorMockInstance.en },
            pt: { ...armorMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Armor ${armorMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Armor ${armorMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(ArmorsModelMock, 'findOne')
                .mockResolvedValueOnce(armorMockFindInstance)
                .mockResolvedValueOnce({ ...armorMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...armorMockFindInstance, active: true })
                .mockResolvedValueOnce(armorMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(ArmorsModelMock, 'update')
                .mockResolvedValueOnce(armorMockUpdateInstance)
                .mockResolvedValueOnce({ ...armorMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await ArmorsServicesMock.updateAvailability(armorMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await ArmorsServicesMock.updateAvailability(armorMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the armor is already enabled', async () => {
            try {
                await ArmorsServicesMock.updateAvailability(armorMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already enabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the armor is already disabled', async () => {
            try {
                await ArmorsServicesMock.updateAvailability(armorMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already disabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ArmorsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an armor with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
