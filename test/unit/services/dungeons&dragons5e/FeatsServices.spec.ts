import DatabaseManagement, { DnDFeat, Internacional, SchemasDnDType } from '@tablerise/database-management';
import FeatsServices from 'src/services/dungeons&dragons5e/FeatsServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';

describe('Services :: DungeonsAndDragons5e :: FeatsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const FeatsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Feats');
    const FeatsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
    const FeatsServicesMock = new FeatsServices(FeatsModelMock, logger, ValidateDataMock, FeatsSchemaMock);

    const featMockInstance = mocks.feat.instance as Internacional<Feat>;
    const { _id: _, ...featMockPayload } = featMockInstance;

    describe('When the recover all feats service is called', () => {
        beforeAll(() => {
            jest.spyOn(FeatsModelMock, 'findAll').mockResolvedValue([featMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await FeatsServicesMock.findAll();
            expect(responseTest).toStrictEqual([featMockInstance]);
        });
    });

    describe('When the recover all disabled feats service is called', () => {
        const featMockDisabled = { ...featMockInstance, active: false };

        beforeAll(() => {
            jest.spyOn(FeatsModelMock, 'findAll').mockResolvedValue([featMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await FeatsServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([featMockDisabled]);
        });
    });

    describe('When the recover a feat by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(FeatsModelMock, 'findOne').mockResolvedValueOnce(featMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await FeatsServicesMock.findOne(featMockInstance._id as string);
            expect(responseTest).toBe(featMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await FeatsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a feat is called', () => {
        const featMockID = featMockInstance._id as string;
        const featMockUpdateInstance = {
            en: { ...featMockInstance.en, name: 'None' },
            pt: { ...featMockInstance.pt, name: 'None' },
        };

        const featMockPayloadWithoutActive = { ...featMockPayload };
        delete featMockPayloadWithoutActive.active;

        const { name: _1, ...featMockEnWithoutName } = featMockPayload.en;
        const { name: _2, ...featMockPtWithoutName } = featMockPayload.pt;
        const featMockPayloadWrong = {
            en: featMockEnWithoutName,
            pt: featMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(FeatsModelMock, 'update').mockResolvedValueOnce(featMockUpdateInstance).mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await FeatsServicesMock.update(
                featMockID,
                featMockPayloadWithoutActive as Internacional<Feat>
            );
            expect(responseTest).toBe(featMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await FeatsServicesMock.update(featMockID, featMockPayloadWrong as Internacional<Feat>);
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
                await FeatsServicesMock.update('inexistent_id', featMockPayload as Internacional<Feat>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await FeatsServicesMock.update('inexistent_id', featMockPayloadWithoutActive as Internacional<Feat>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability feat is called', () => {
        const featMockID = featMockInstance._id as string;
        const featMockUpdateInstance = {
            _id: featMockID,
            active: false,
            en: { ...featMockInstance.en },
            pt: { ...featMockInstance.pt },
        };

        const featMockFindInstance = {
            _id: featMockID,
            active: true,
            en: { ...featMockInstance.en },
            pt: { ...featMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Feat ${featMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Feat ${featMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(FeatsModelMock, 'findOne')
                .mockResolvedValueOnce(featMockFindInstance)
                .mockResolvedValueOnce({ ...featMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...featMockFindInstance, active: true })
                .mockResolvedValueOnce(featMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(FeatsModelMock, 'update')
                .mockResolvedValueOnce(featMockUpdateInstance)
                .mockResolvedValueOnce({ ...featMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await FeatsServicesMock.updateAvailability(featMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await FeatsServicesMock.updateAvailability(featMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the background is already enabled', async () => {
            try {
                await FeatsServicesMock.updateAvailability(featMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the background is already disabled', async () => {
            try {
                await FeatsServicesMock.updateAvailability(featMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await FeatsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
