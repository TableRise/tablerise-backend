/* eslint-disable @typescript-eslint/no-unnecessary-type-assertion */
import DatabaseManagement, { DnDBackground, Internacional, SchemasDnDType } from '@tablerise/database-management';
import BackgroundsServices from 'src/services/dungeons&dragons5e/BackgroundsServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';

describe('Services :: DungeonsAndDragons5e :: BackgroundsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const BackgroundsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Backgrounds');
    const BackgroundsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
    const BackgroundsServicesMock = new BackgroundsServices(
        BackgroundsModelMock,
        logger,
        ValidateDataMock,
        BackgroundsSchemaMock
    );

    const backgroundMockInstance = mocks.background.instance as Internacional<Background>;
    const { _id: _, ...backgroundMockPayload } = backgroundMockInstance;

    describe('When the recover all backgrounds service is called', () => {
        beforeAll(() => {
            jest.spyOn(BackgroundsModelMock, 'findAll').mockResolvedValue([backgroundMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await BackgroundsServicesMock.findAll();
            expect(responseTest).toStrictEqual([backgroundMockInstance]);
        });
    });

    describe('When the recover all disabled backgrounds service is called', () => {
        const backgroundMockDisabled = { ...backgroundMockInstance, active: false };

        beforeAll(() => {
            jest.spyOn(BackgroundsModelMock, 'findAll').mockResolvedValue([backgroundMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await BackgroundsServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([backgroundMockDisabled]);
        });
    });

    describe('When the recover a background by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(BackgroundsModelMock, 'findOne')
                .mockResolvedValueOnce(backgroundMockInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await BackgroundsServicesMock.findOne(backgroundMockInstance._id as string);
            expect(responseTest).toBe(backgroundMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await BackgroundsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a background is called', () => {
        const backgroundMockID = backgroundMockInstance._id as string;
        const backgroundMockUpdateInstance = {
            en: { ...backgroundMockInstance.en, name: 'None' },
            pt: { ...backgroundMockInstance.pt, name: 'None' },
        };

        const backgroundMockPayloadWithoutActive = { ...backgroundMockPayload };
        delete backgroundMockPayloadWithoutActive.active;

        const { name: _1, ...backgroundMockEnWithoutName } = backgroundMockPayload.en;
        const { name: _2, ...backgroundMockPtWithoutName } = backgroundMockPayload.pt;
        const backgroundMockPayloadWrong = {
            en: backgroundMockEnWithoutName,
            pt: backgroundMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(BackgroundsModelMock, 'update')
                .mockResolvedValueOnce(backgroundMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await BackgroundsServicesMock.update(
                backgroundMockID,
                backgroundMockPayloadWithoutActive as Internacional<Background>
            );
            expect(responseTest).toBe(backgroundMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await BackgroundsServicesMock.update(
                    backgroundMockID,
                    backgroundMockPayloadWrong as Internacional<Background>
                );
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
                await BackgroundsServicesMock.update(
                    'inexistent_id',
                    backgroundMockPayload as Internacional<Background>
                );
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await BackgroundsServicesMock.update(
                    'inexistent_id',
                    backgroundMockPayloadWithoutActive as Internacional<Background>
                );
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability background is called', () => {
        const backgroundMockID = backgroundMockInstance._id as string;
        const backgroundMockUpdateInstance = {
            _id: backgroundMockID,
            active: false,
            en: { ...backgroundMockInstance.en },
            pt: { ...backgroundMockInstance.pt },
        };

        const backgroundMockFindInstance = {
            _id: backgroundMockID,
            active: true,
            en: { ...backgroundMockInstance.en },
            pt: { ...backgroundMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Background ${backgroundMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Background ${backgroundMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(BackgroundsModelMock, 'findOne')
                .mockResolvedValueOnce(backgroundMockFindInstance)
                .mockResolvedValueOnce({ ...backgroundMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...backgroundMockFindInstance, active: true })
                .mockResolvedValueOnce(backgroundMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(BackgroundsModelMock, 'update')
                .mockResolvedValueOnce(backgroundMockUpdateInstance)
                .mockResolvedValueOnce({ ...backgroundMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await BackgroundsServicesMock.updateAvailability(backgroundMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await BackgroundsServicesMock.updateAvailability(backgroundMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the background is already enabled', async () => {
            try {
                await BackgroundsServicesMock.updateAvailability(backgroundMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the background is already disabled', async () => {
            try {
                await BackgroundsServicesMock.updateAvailability(backgroundMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await BackgroundsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
