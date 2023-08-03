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
        const armorMockDisabled = { active: false, ...armorMockInstance };
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
                expect(err.message).toBe('Not authorized to change availability');
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

        const armorMockPayloadWithoutActive = { ...armorMockPayload };
        delete armorMockPayloadWithoutActive.active;

        const queryMock = false;

        const responseMessageMock = {
            message: `Armor ${armorMockID} was ${queryMock ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(ArmorsModelMock, 'findOne')
                .mockResolvedValueOnce(armorMockFindInstance)
                .mockResolvedValueOnce(armorMockFindInstance)
                .mockResolvedValueOnce(armorMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(ArmorsModelMock, 'update')
                .mockResolvedValueOnce(armorMockUpdateInstance)
                .mockResolvedValueOnce(armorMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct success message', async () => {
            const responseTest = await ArmorsServicesMock.updateAvailability(armorMockID, queryMock);
            expect(responseTest).toStrictEqual(responseMessageMock);
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
