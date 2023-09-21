import DatabaseManagement from '@tablerise/database-management';
import GodsServices from 'src/services/dungeons&dragons5e/GodsServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import { God } from 'src/schemas/dungeons&dragons5e/godsValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';

describe('Services :: DungeonsAndDragons5e :: GodsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const GodsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Gods');
    const GodsServicesMock = new GodsServices(GodsModelMock, logger, ValidateDataMock, schema['dungeons&dragons5e']);

    const godMockInstance = mocks.god.instance as Internacional<God>;
    const { _id: _, ...godMockPayload } = godMockInstance;

    describe('When the recover all enabled gods service is called', () => {
        beforeAll(() => {
            jest.spyOn(GodsModelMock, 'findAll').mockResolvedValue([godMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await GodsServicesMock.findAll();
            expect(responseTest).toStrictEqual([godMockInstance]);
        });
    });

    describe('When the recover all disabled gods service is called', () => {
        const godMockDisabled = { active: false, ...godMockInstance };

        beforeAll(() => {
            jest.spyOn(GodsModelMock, 'findAll').mockResolvedValue([godMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await GodsServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([godMockDisabled]);
        });
    });

    describe('When the recover a god by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(GodsModelMock, 'findOne').mockResolvedValueOnce(godMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await GodsServicesMock.findOne(godMockInstance._id as string);
            expect(responseTest).toBe(godMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await GodsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a god is called', () => {
        const godMockID = godMockInstance._id as string;
        const godMockUpdateInstance = {
            en: { ...godMockInstance.en, name: 'None' },
            pt: { ...godMockInstance.pt, name: 'None' },
        };
        const godMockPayloadWithoutActive = { ...godMockPayload };
        delete godMockPayloadWithoutActive.active;

        const { name: _1, ...godsMockEnWithoutName } = godMockPayload.en;
        const { name: _2, ...godsMockPtWithoutName } = godMockPayload.pt;
        const godMockPayloadWrong = {
            en: godsMockEnWithoutName,
            pt: godsMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(GodsModelMock, 'update').mockResolvedValueOnce(godMockUpdateInstance).mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await GodsServicesMock.update(
                godMockID,
                godMockPayloadWithoutActive as Internacional<God>
            );
            expect(responseTest).toBe(godMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await GodsServicesMock.update(godMockID, godMockPayloadWrong as Internacional<God>);
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
                await GodsServicesMock.update('inexistent_id', godMockPayload as Internacional<God>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await GodsServicesMock.update('inexistent_id', godMockPayloadWithoutActive as Internacional<God>);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability god is called', () => {
        const godMockID = godMockInstance._id as string;
        const godMockUpdateInstance = {
            _id: godMockID,
            active: false,
            en: { ...godMockInstance.en },
            pt: { ...godMockInstance.pt },
        };

        const godMockFindInstance = {
            _id: godMockID,
            active: true,
            en: { ...godMockInstance.en },
            pt: { ...godMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `God ${godMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `God ${godMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(GodsModelMock, 'findOne')
                .mockResolvedValueOnce(godMockFindInstance)
                .mockResolvedValueOnce({ ...godMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...godMockFindInstance, active: true })
                .mockResolvedValueOnce(godMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(GodsModelMock, 'update')
                .mockResolvedValueOnce(godMockUpdateInstance)
                .mockResolvedValueOnce(godMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await GodsServicesMock.updateAvailability(godMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await GodsServicesMock.updateAvailability(godMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the god is already enabled', async () => {
            try {
                await GodsServicesMock.updateAvailability(godMockID, true);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the god is already disabled', async () => {
            try {
                await GodsServicesMock.updateAvailability(godMockID, false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await GodsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
