import ClassesModel from 'src/database/models/dungeons&dragons5e/ClassesModel';
import ClassesServices from 'src/services/dungeons&dragons5e/ClassesServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Class } from 'src/schemas/dungeons&dragons5e/classesValidationSchema';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import Connections from 'src/database/DatabaseConnection';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ClassesServices', () => {
    const ClassesModelMock = new ClassesModel();
    const ValidateDataMock = new ValidateData(logger);
    const ClassesServicesMock = new ClassesServices(ClassesModelMock, logger, ValidateDataMock);
    const classMockInstance = mocks.class.instance as Internacional<Class>;
    const { _id: _, ...classMockPayload } = classMockInstance;

    afterAll(async () => {
        await Connections['dungeons&dragons5e'].close();
    });

    describe('When the recover all enabled classes service is called', () => {
        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findAll').mockResolvedValue([classMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await ClassesServicesMock.findAll();
            expect(responseTest).toStrictEqual([classMockInstance]);
        });
    });

    describe('When the recover all disabled classes service is called', () => {
        const classMockDisabled = { ...classMockInstance, active: false };
        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findAll').mockResolvedValue([classMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await ClassesServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([classMockDisabled]);
        });
    });

    describe('When the recover a class by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findOne').mockResolvedValueOnce(classMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await ClassesServicesMock.findOne(classMockInstance._id as string);
            expect(responseTest).toBe(classMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ClassesServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a class is called', () => {
        const classMockID = classMockInstance._id as string;
        const classMockUpdateInstance = {
            en: { ...classMockInstance.en, name: 'None' },
            pt: { ...classMockInstance.pt, name: 'None' },
        };
        const classMockPayloadWithoutActive = { ...classMockPayload };
        delete classMockPayloadWithoutActive.active;

        const { name: _1, ...classesMockEnWithoutName } = classMockPayload.en;
        const { name: _2, ...classesMockPtWithoutName } = classMockPayload.pt;
        const classMockPayloadWrong = {
            en: classesMockEnWithoutName,
            pt: classesMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'update')
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await ClassesServicesMock.update(
                classMockID,
                classMockPayloadWithoutActive as Internacional<Class>
            );
            expect(responseTest).toBe(classMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await ClassesServicesMock.update(classMockID, classMockPayloadWrong as Internacional<Class>);
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
                await ClassesServicesMock.update('inexistent_id', classMockPayload as Internacional<Class>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ClassesServicesMock.update(
                    'inexistent_id',
                    classMockPayloadWithoutActive as Internacional<Class>
                );
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability class is called', () => {
        const classMockID = classMockInstance._id as string;
        const classMockUpdateInstance = {
            _id: classMockID,
            active: false,
            en: { ...classMockInstance.en },
            pt: { ...classMockInstance.pt },
        };

        const classMockFindInstance = {
            _id: classMockID,
            active: true,
            en: { ...classMockInstance.en },
            pt: { ...classMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Class ${classMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Class ${classMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findOne')
                .mockResolvedValueOnce(classMockFindInstance)
                .mockResolvedValueOnce({ ...classMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...classMockFindInstance, active: true })
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(ClassesModelMock, 'update')
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValueOnce({ ...classMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await ClassesServicesMock.updateAvailability(classMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await ClassesServicesMock.updateAvailability(classMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the class is already enabled', async () => {
            try {
                await ClassesServicesMock.updateAvailability(classMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the class is already disabled', async () => {
            try {
                await ClassesServicesMock.updateAvailability(classMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ClassesServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
