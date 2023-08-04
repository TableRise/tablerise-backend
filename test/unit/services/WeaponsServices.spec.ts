import WeaponsModel from 'src/database/models/WeaponsModel';
import WeaponsServices from 'src/services/WeaponsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Weapon } from 'src/schemas/weaponsValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: WeaponsServices', () => {
    const WeaponsModelMock = new WeaponsModel();
    const WeaponsServicesMock = new WeaponsServices(WeaponsModelMock, logger);
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
        const weaponMockDisabled = { active: false, ...weaponMockInstance };
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
                const err = error as Error;
                expect(err.message).toBe('NotFound a weapon with provided ID');
                expect(err.stack).toBe('404');
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
                const err = error as Error;
                expect(JSON.parse(err.message)[0].path).toStrictEqual(['en', 'name']);
                expect(JSON.parse(err.message)[0].message).toBe('Required');
                expect(err.stack).toBe('422');
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when try to update availability', async () => {
            try {
                await WeaponsServicesMock.update('inexistent_id', weaponMockPayload as Internacional<Weapon>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
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
                const err = error as Error;
                expect(err.message).toBe('NotFound a weapon with provided ID');
                expect(err.stack).toBe('404');
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

        const weaponMockPayloadWithoutActive = { ...weaponMockPayload };
        delete weaponMockPayloadWithoutActive.active;

        const queryMock = false;

        const responseMessageMock = {
            message: `Weapon ${weaponMockID} was ${queryMock ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(WeaponsModelMock, 'findOne')
                .mockResolvedValueOnce(weaponMockFindInstance)
                .mockResolvedValueOnce(weaponMockFindInstance)
                .mockResolvedValueOnce(weaponMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(WeaponsModelMock, 'update')
                .mockResolvedValueOnce(weaponMockUpdateInstance)
                .mockResolvedValueOnce(weaponMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct success message', async () => {
            const responseTest = await WeaponsServicesMock.updateAvailability(weaponMockID, queryMock);
            expect(responseTest).toStrictEqual(responseMessageMock);
        });

        it('should throw an error when the weapon is already enabled', async () => {
            try {
                await WeaponsServicesMock.updateAvailability(weaponMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already enabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the weapon is already disabled', async () => {
            try {
                await WeaponsServicesMock.updateAvailability(weaponMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already disabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WeaponsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a weapon with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
