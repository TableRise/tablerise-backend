import ClassesModel from 'src/database/models/ClassesModel';
import ClassesServices from 'src/services/ClassesServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Class } from 'src/schemas/classesValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: ClassesServices', () => {
    const ClassesModelMock = new ClassesModel();
    const ClassesServicesMock = new ClassesServices(ClassesModelMock, logger);
    const classMockInstance = mocks.class.instance as Internacional<Class>;
    const { _id: _, ...classMockPayload } = classMockInstance;

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
        const classMockDisabled = {active: false, ...classMockInstance}
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
                expect(err.message).toBe('NotFound a class with provided ID');
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
                expect(err.message).toBe('Not authorized to change availability');
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
                expect(err.message).toBe('NotFound a class with provided ID');
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

        const classMockPayloadWithoutActive = { ...classMockPayload };
        delete classMockPayloadWithoutActive.active;

        const queryMock = false;

        const responseMessageMock = {
            message: `Class ${classMockID} was ${queryMock ? 'activated' : 'deactivated'}`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(ClassesModelMock, 'findOne')
                .mockResolvedValueOnce(classMockFindInstance)
                .mockResolvedValueOnce(classMockFindInstance)
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(ClassesModelMock, 'update')
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValueOnce(classMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct success message', async () => {
            const responseTest = await ClassesServicesMock.updateAvailability(classMockID, queryMock);
            expect(responseTest).toStrictEqual(responseMessageMock);
        });

        it('should throw an error when the class is already enabled', async () => {
            try {
                await ClassesServicesMock.updateAvailability(classMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already enabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the class is already disabled', async () => {
            try {
                await ClassesServicesMock.updateAvailability(classMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already disabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await ClassesServicesMock.updateAvailability(
                    'inexistent_id',
                    false
                );
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a class with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    // describe('When service for delete a class is called', () => {
    //     const classMockID = classMockInstance._id as string;

    //     beforeAll(() => {
    //         jest.spyOn(ClassesModelMock, 'findOne').mockResolvedValueOnce(classMockInstance).mockResolvedValue(null);

    //         jest.spyOn(ClassesModelMock, 'delete').mockResolvedValue(null);
    //     });

    //     it('should delete class and not return any data', async () => {
    //         try {
    //             await ClassesServicesMock.delete(classMockID);
    //         } catch (error) {
    //             fail('it should not reach here');
    //         }
    //     });

    //     it('should throw an error when ID is inexistent', async () => {
    //         try {
    //             await ClassesServicesMock.delete('inexistent_id');
    //         } catch (error) {
    //             const err = error as Error;
    //             expect(err.message).toBe('NotFound a class with provided ID');
    //             expect(err.stack).toBe('404');
    //             expect(err.name).toBe('NotFound');
    //         }
    //     });
    // });
});
