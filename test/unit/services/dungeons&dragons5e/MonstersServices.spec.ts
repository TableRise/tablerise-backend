import DatabaseManagement from '@tablerise/database-management';
import MonstersServices from 'src/services/dungeons&dragons5e/MonstersServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import { Monster } from 'src/schemas/dungeons&dragons5e/monstersValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';

describe('Services :: DungeonsAndDragons5e :: MonstersServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const MonstersModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Monsters');
    const MonstersServicesMock = new MonstersServices(
        MonstersModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );

    const monsterMockInstance = mocks.monster.instance as Internacional<Monster>;
    const { _id: _, ...monsterMockPayload } = monsterMockInstance;

    describe('When the recover all enabled monsters service is called', () => {
        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'findAll').mockResolvedValue([monsterMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await MonstersServicesMock.findAll();
            expect(responseTest).toStrictEqual([monsterMockInstance]);
        });
    });

    describe('When the recover all disabled monster service is called', () => {
        const monsterMockDisabled = { ...monsterMockInstance, active: false };

        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'findAll').mockResolvedValue([monsterMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await MonstersServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([monsterMockDisabled]);
        });
    });

    describe('When the recover a monster by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'findOne').mockResolvedValueOnce(monsterMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await MonstersServicesMock.findOne(monsterMockInstance._id as string);
            expect(responseTest).toBe(monsterMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await MonstersServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a monster is called', () => {
        const monsterMockID = monsterMockInstance._id as string;
        const monsterMockUpdateInstance = {
            en: { ...monsterMockInstance.en, name: 'None' },
            pt: { ...monsterMockInstance.pt, name: 'None' },
        };
        const monsterMockPayloadWithoutActive = { ...monsterMockPayload };
        delete monsterMockPayloadWithoutActive.active;

        const { name: _1, ...monstersMockEnWithoutName } = monsterMockPayload.en;
        const { name: _2, ...monstersMockPtWithoutName } = monsterMockPayload.pt;
        const monsterMockPayloadWrong = {
            en: monstersMockEnWithoutName,
            pt: monstersMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'update')
                .mockResolvedValueOnce(monsterMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await MonstersServicesMock.update(
                monsterMockID,
                monsterMockPayloadWithoutActive as Internacional<Monster>
            );
            expect(responseTest).toBe(monsterMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await MonstersServicesMock.update(monsterMockID, monsterMockPayloadWrong as Internacional<Monster>);
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
                await MonstersServicesMock.update('inexistent_id', monsterMockPayload as Internacional<Monster>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await MonstersServicesMock.update(
                    'inexistent_id',
                    monsterMockPayloadWithoutActive as Internacional<Monster>
                );
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability monster is called', () => {
        const monsterMockID = monsterMockInstance._id as string;
        const monsterMockUpdateInstance = {
            _id: monsterMockID,
            active: false,
            en: { ...monsterMockInstance.en },
            pt: { ...monsterMockInstance.pt },
        };

        const monsterMockFindInstance = {
            _id: monsterMockID,
            active: true,
            en: { ...monsterMockInstance.en },
            pt: { ...monsterMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Monster ${monsterMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Monster ${monsterMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'findOne')
                .mockResolvedValueOnce(monsterMockFindInstance)
                .mockResolvedValueOnce({ ...monsterMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...monsterMockFindInstance, active: true })
                .mockResolvedValueOnce(monsterMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(MonstersModelMock, 'update')
                .mockResolvedValueOnce(monsterMockUpdateInstance)
                .mockResolvedValueOnce({ ...monsterMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await MonstersServicesMock.updateAvailability(monsterMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await MonstersServicesMock.updateAvailability(monsterMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the monster is already enabled', async () => {
            try {
                await MonstersServicesMock.updateAvailability(monsterMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the monster is already disabled', async () => {
            try {
                await MonstersServicesMock.updateAvailability(monsterMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await MonstersServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
