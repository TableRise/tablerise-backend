import DatabaseManagement from '@tablerise/database-management';
import WeaponsServices from 'src/services/dungeons&dragons5e/WeaponsServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/services/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import { Weapon } from 'src/schemas/dungeons&dragons5e/weaponsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

describe('Services :: DungeonsAndDragons5e :: WeaponsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const WeaponsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Weapons');
    const WeaponsServicesMock = new WeaponsServices(
        WeaponsModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );

    const weaponMockInstance = mocks.weapon.instance as Internacional<Weapon>;
    const { _id: _, ...weaponMockPayload } = weaponMockInstance;

    describe('When the recover all enabled weapons service is called', () => {
        beforeAll(() => {
            jest.spyOn(WeaponsModelMock, 'findAll').mockResolvedValue([weaponMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await WeaponsServicesMock.findAll();
            expect(responseTest).toStrictEqual([weaponMockInstance]);
        });
    });

    describe('When the recover all disabled weapons service is called', () => {
        const weaponMockDisabled = { ...weaponMockInstance, active: false };

        beforeAll(() => {
            jest.spyOn(WeaponsModelMock, 'findAll').mockResolvedValue([weaponMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await WeaponsServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([weaponMockDisabled]);
        });
    });

    describe('When the recover a weapon by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(WeaponsModelMock, 'findOne').mockResolvedValueOnce(weaponMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await WeaponsServicesMock.findOne(weaponMockInstance._id as string);
            expect(responseTest).toBe(weaponMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WeaponsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a weapon is called', () => {
        const weaponMockID = weaponMockInstance._id as string;
        const weaponMockUpdateInstance = {
            en: { ...weaponMockInstance.en, name: 'None' },
            pt: { ...weaponMockInstance.pt, name: 'None' },
        };
        const weaponMockPayloadWithoutActive = { ...weaponMockPayload };
        delete weaponMockPayloadWithoutActive.active;

        const { name: _1, ...weaponsMockEnWithoutName } = weaponMockPayload.en;
        const { name: _2, ...weaponsMockPtWithoutName } = weaponMockPayload.pt;
        const weaponMockPayloadWrong = {
            en: weaponsMockEnWithoutName,
            pt: weaponsMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(WeaponsModelMock, 'update')
                .mockResolvedValueOnce(weaponMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await WeaponsServicesMock.update(
                weaponMockID,
                weaponMockPayloadWithoutActive as Internacional<Weapon>
            );
            expect(responseTest).toBe(weaponMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await WeaponsServicesMock.update(weaponMockID, weaponMockPayloadWrong as Internacional<Weapon>);
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
                await WeaponsServicesMock.update('inexistent_id', weaponMockPayload as Internacional<Weapon>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WeaponsServicesMock.update(
                    'inexistent_id',
                    weaponMockPayloadWithoutActive as Internacional<Weapon>
                );
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability weapon is called', () => {
        const weaponMockID = weaponMockInstance._id as string;
        const weaponMockUpdateInstance = {
            _id: weaponMockID,
            active: false,
            en: { ...weaponMockInstance.en },
            pt: { ...weaponMockInstance.pt },
        };

        const weaponMockFindInstance = {
            _id: weaponMockID,
            active: true,
            en: { ...weaponMockInstance.en },
            pt: { ...weaponMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Weapon ${weaponMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Weapon ${weaponMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(WeaponsModelMock, 'findOne')
                .mockResolvedValueOnce(weaponMockFindInstance)
                .mockResolvedValueOnce({ ...weaponMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...weaponMockFindInstance, active: true })
                .mockResolvedValueOnce(weaponMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(WeaponsModelMock, 'update')
                .mockResolvedValueOnce(weaponMockUpdateInstance)
                .mockResolvedValueOnce({ ...weaponMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await WeaponsServicesMock.updateAvailability(weaponMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await WeaponsServicesMock.updateAvailability(weaponMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the weapon is already enabled', async () => {
            try {
                await WeaponsServicesMock.updateAvailability(weaponMockID, true);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the weapon is already disabled', async () => {
            try {
                await WeaponsServicesMock.updateAvailability(weaponMockID, false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WeaponsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
