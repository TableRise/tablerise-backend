import DatabaseManagement from '@tablerise/database-management';
import RealmsServices from 'src/services/dungeons&dragons5e/RealmsServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/services/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import { Realm } from 'src/schemas/dungeons&dragons5e/realmsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/services/helpers/HttpRequestErrors';

describe('Services :: DungeonsAndDragons5e :: RealmsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const RealmsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Realms');
    const RealmsServicesMock = new RealmsServices(
        RealmsModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );

    const realmsMockInstance = mocks.realm.instance as Internacional<Realm>;
    const { _id: _, ...realmsMockPayload } = realmsMockInstance;

    describe('When the recover all enabled realms service is called', () => {
        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'findAll').mockResolvedValue([realmsMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await RealmsServicesMock.findAll();
            expect(responseTest).toStrictEqual([realmsMockInstance]);
        });
    });

    describe('When the recover all disabled realms service is called', () => {
        const realmMockDisabled = { active: false, ...realmsMockInstance };
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
            jest.spyOn(RealmsModelMock, 'findOne').mockResolvedValueOnce(realmsMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await RealmsServicesMock.findOne(realmsMockInstance._id as string);
            expect(responseTest).toBe(realmsMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RealmsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a realm is called', () => {
        const realmMockID = realmsMockInstance._id as string;
        const realmMockUpdateInstance = {
            en: { ...realmsMockInstance.en, name: 'None' },
            pt: { ...realmsMockInstance.pt, name: 'None' },
        };
        const realmMockPayloadWithoutActive = { ...realmsMockPayload };
        delete realmMockPayloadWithoutActive.active;

        const { name: _1, ...realmsMockEnWithoutName } = realmsMockPayload.en;
        const { name: _2, ...realmsMockPtWithoutName } = realmsMockPayload.pt;
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
                await RealmsServicesMock.update('inexistent_id', realmsMockPayload as Internacional<Realm>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RealmsServicesMock.update('inexistent_id', realmMockPayloadWithoutActive as Internacional<Realm>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability realm is called', () => {
        const realmMockID = realmsMockInstance._id as string;
        const realmMockUpdateInstance = {
            _id: realmMockID,
            active: false,
            en: { ...realmsMockInstance.en },
            pt: { ...realmsMockInstance.pt },
        };

        const realmMockFindInstance = {
            _id: realmMockID,
            active: true,
            en: { ...realmsMockInstance.en },
            pt: { ...realmsMockInstance.pt },
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
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the realm is already disabled', async () => {
            try {
                await RealmsServicesMock.updateAvailability(realmMockID, false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RealmsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
