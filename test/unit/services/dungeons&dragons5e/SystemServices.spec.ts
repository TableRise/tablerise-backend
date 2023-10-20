import DatabaseManagement from '@tablerise/database-management';
import SystemsServices from 'src/services/dungeons&dragons5e/SystemServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import SchemaValidator from 'src/infra/helpers/SchemaValidator';

import logger from '@tablerise/dynamic-logger';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/infra/helpers/HttpRequestErrors';

describe('Services :: DungeonsAndDragons5e :: SystemsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new SchemaValidator();

    const SystemsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'System');
    const SystemsServicesMock = new SystemsServices(
        SystemsModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );

    const systemMockInstance = mocks.system.instance as System & { _id: string };
    const { content: _, _id: __, ...systemMockPayload } = systemMockInstance;

    const updateContentMockInstance = mocks.updateSystemContent.instance as UpdateContent;

    describe('When the recover all system service is called', () => {
        beforeAll(() => {
            jest.spyOn(SystemsModelMock, 'findAll').mockResolvedValue([systemMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await SystemsServicesMock.findAll();
            expect(responseTest).toStrictEqual([systemMockInstance]);
        });
    });

    describe('When the recover a system by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(SystemsModelMock, 'findOne').mockResolvedValueOnce(systemMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await SystemsServicesMock.findOne(systemMockInstance._id);
            expect(responseTest).toBe(systemMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SystemsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a system is called', () => {
        const systemMockID = systemMockInstance._id;
        const systemMockUpdateInstance = {
            ...systemMockInstance,
            active: false,
            name: 'D&D',
        };

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { name: ___, ...systemMockPayloadWrong } = systemMockPayload;

        beforeAll(() => {
            jest.spyOn(SystemsModelMock, 'update')
                .mockResolvedValueOnce(systemMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await SystemsServicesMock.update(systemMockID, systemMockPayload);
            expect(responseTest).toBe(systemMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await SystemsServicesMock.update(systemMockID, systemMockPayloadWrong as System);
            } catch (error) {
                const err = error as HttpRequestErrors;

                expect(err.details).toHaveLength(1);
                expect(err.details[0].attribute).toBe('name');
                expect(err.details[0].reason).toBe('Required');
                expect(err.code).toBe(422);
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SystemsServicesMock.update('inexistent_id', systemMockPayload);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });

        it('should throw an error when system content is given', async () => {
            try {
                await SystemsServicesMock.update(systemMockID, systemMockInstance);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });
    });

    describe('When service for update a system content is called', () => {
        const { method, newID } = updateContentMockInstance;
        const systemMockID = systemMockInstance._id;
        const entityMockQuery = 'races';
        const { method: __, ...updateContentWithoutMethod } = updateContentMockInstance;
        const updateResult = `New ID ${newID} was ${method} to array of entities ${entityMockQuery} - system ID: ${systemMockInstance._id}`;

        beforeAll(() => {
            jest.spyOn(SystemsModelMock, 'findOne')
                .mockResolvedValueOnce(systemMockInstance)
                .mockResolvedValueOnce(systemMockInstance)
                .mockResolvedValue(null);
            jest.spyOn(SystemsModelMock, 'update').mockResolvedValue(systemMockInstance);
        });

        it('should return a confirmation of add an entity ID', async () => {
            const responseTest = await SystemsServicesMock.updateContent(
                systemMockID,
                entityMockQuery,
                updateContentMockInstance
            );
            expect(responseTest).toBe(updateResult);
        });

        it('should return a confirmation of remove an entity ID', async () => {
            const updateContentMockInstanceRemove: UpdateContent = {
                method: 'remove',
                newID: systemMockInstance.content.races[0],
            };
            const { method, newID } = updateContentMockInstanceRemove;
            const updateResult = `New ID ${newID} was ${method} to array of entities ${entityMockQuery} - system ID: ${systemMockInstance._id}`;

            const responseTest = await SystemsServicesMock.updateContent(
                systemMockID,
                entityMockQuery,
                updateContentMockInstanceRemove
            );
            expect(responseTest).toBe(updateResult);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await SystemsServicesMock.updateContent(
                    systemMockID,
                    entityMockQuery,
                    updateContentWithoutMethod as UpdateContent
                );
            } catch (error) {
                const err = error as HttpRequestErrors;

                expect(err.details).toHaveLength(1);
                expect(err.details[0].attribute).toBe('method');
                expect(err.details[0].reason).toBe('Required');
                expect(err.code).toBe(422);
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when there is no entityQuery', async () => {
            try {
                await SystemsServicesMock.updateContent(
                    systemMockID,
                    undefined as unknown as string,
                    updateContentMockInstance
                );
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SystemsServicesMock.updateContent('inexistent_id', entityMockQuery, updateContentMockInstance);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for activate a system is called', () => {
        const systemMockID = systemMockInstance._id;
        const systemMockUpdateInstance = {
            _id: systemMockID,
            active: false,
        };

        const systemMockFindInstance = {
            _id: systemMockID,
            active: true,
        };

        const responseMessageMockActivated = {
            message: `System ${systemMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `System ${systemMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(SystemsModelMock, 'findOne')
                .mockResolvedValueOnce(systemMockFindInstance)
                .mockResolvedValueOnce({ ...systemMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...systemMockFindInstance, active: true })
                .mockResolvedValueOnce(systemMockUpdateInstance)
                .mockResolvedValueOnce(null);

            jest.spyOn(SystemsModelMock, 'update')
                .mockResolvedValue(systemMockUpdateInstance)
                .mockResolvedValue(systemMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await SystemsServicesMock.updateAvailability(systemMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await SystemsServicesMock.updateAvailability(systemMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the realm is already enabled', async () => {
            try {
                await SystemsServicesMock.updateAvailability(systemMockID, true);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the realm is already disabled', async () => {
            try {
                await SystemsServicesMock.updateAvailability(systemMockID, false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SystemsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
