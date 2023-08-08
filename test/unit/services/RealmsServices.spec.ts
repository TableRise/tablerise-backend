import RealmsModel from 'src/database/models/RealmsModel';
import RealmsServices from 'src/services/RealmsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Realm } from 'src/schemas/realmsValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: RealmsServices', () => {
    const RealmsModelMock = new RealmsModel();
    const RealmsServicesMock = new RealmsServices(RealmsModelMock, logger);
    const realmMockInstance = mocks.realm.instance as Internacional<Realm>;
    const { _id: _, ...realmMockPayload } = realmMockInstance;

    describe('When the recover all enabled realms service is called', () => {
        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'findAll').mockResolvedValue([realmMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await RealmsServicesMock.findAll();
            expect(responseTest).toStrictEqual([realmMockInstance]);
        });
    });

    describe('When the recover all disabled realms service is called', () => {
        const realmMockDisabled = { active: false, ...realmMockInstance };
        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'findAll').mockResolvedValue([realmMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await RealmsServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([realmMockDisabled]);
        });
    });

    describe('When the recover a realm by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'findOne').mockResolvedValueOnce(realmMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await RealmsServicesMock.findOne(realmMockInstance._id as string);
            expect(responseTest).toBe(realmMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RealmsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a realm with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a realm is called', () => {
        const realmMockID = realmMockInstance._id as string;
        const realmMockUpdateInstance = {
            en: { ...realmMockInstance.en, name: 'None' },
            pt: { ...realmMockInstance.pt, name: 'None' },
        };
        const realmMockPayloadWithoutActive = { ...realmMockPayload };
        delete realmMockPayloadWithoutActive.active;

        const { name: _1, ...realmsMockEnWithoutName } = realmMockPayload.en;
        const { name: _2, ...realmsMockPtWithoutName } = realmMockPayload.pt;
        const realmMockPayloadWrong = {
            en: realmsMockEnWithoutName,
            pt: realmsMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'update')
                .mockResolvedValueOnce(realmMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await RealmsServicesMock.update(
                realmMockID,
                realmMockPayloadWithoutActive as Internacional<Realm>
            );
            expect(responseTest).toBe(realmMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await RealmsServicesMock.update(realmMockID, realmMockPayloadWrong as Internacional<Realm>);
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
                await RealmsServicesMock.update('inexistent_id', realmMockPayload as Internacional<Realm>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RealmsServicesMock.update('inexistent_id', realmMockPayloadWithoutActive as Internacional<Realm>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a realm with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability realm is called', () => {
        const realmMockID = realmMockInstance._id as string;
        const realmMockUpdateInstance = {
            _id: realmMockID,
            active: false,
            en: { ...realmMockInstance.en },
            pt: { ...realmMockInstance.pt },
        };

        const realmMockFindInstance = {
            _id: realmMockID,
            active: true,
            en: { ...realmMockInstance.en },
            pt: { ...realmMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Realm ${realmMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Realm ${realmMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'findOne')
                .mockResolvedValueOnce(realmMockFindInstance)
                .mockResolvedValueOnce({ ...realmMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...realmMockFindInstance, active: true })
                .mockResolvedValueOnce(realmMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(RealmsModelMock, 'update')
                .mockResolvedValueOnce(realmMockUpdateInstance)
                .mockResolvedValueOnce(realmMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await RealmsServicesMock.updateAvailability(realmMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await RealmsServicesMock.updateAvailability(realmMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the realm is already enabled', async () => {
            try {
                await RealmsServicesMock.updateAvailability(realmMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already enabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the realm is already disabled', async () => {
            try {
                await RealmsServicesMock.updateAvailability(realmMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already disabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RealmsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a realm with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
