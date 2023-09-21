import DatabaseManagement from '@tablerise/database-management';
import SystemsServices from 'src/services/dungeons&dragons5e/SystemServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

import logger from '@tablerise/dynamic-logger';
import { System } from 'src/schemas/dungeons&dragons5e/systemValidationSchema';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import schema from 'src/schemas';
import HttpRequestErrors from 'src/support/helpers/HttpRequestErrors';

describe('Services :: DungeonsAndDragons5e :: SystemsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData();

    const SystemsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'System');
    const SystemsServicesMock = new SystemsServices(
        SystemsModelMock,
        logger,
        ValidateDataMock,
        schema['dungeons&dragons5e']
    );

    const systemMockInstance = mocks.system.instance as System & { _id: string };
    const systemMockInstanceNoActive = { ...systemMockInstance, active: false };
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
        const updateResult = `New ID ${newID} was ${
            method as string
        } to array of entities ${entityMockQuery} - system ID: ${systemMockInstance._id}`;

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
            const updateResult = `New ID ${newID} was ${
                method as string
            } to array of entities ${entityMockQuery} - system ID: ${systemMockInstance._id}`;

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
        beforeAll(() => {
            jest.spyOn(SystemsModelMock, 'findOne')
                .mockResolvedValueOnce(systemMockInstanceNoActive)
                .mockResolvedValueOnce(null)
                .mockResolvedValue(systemMockInstanceNoActive);
            jest.spyOn(SystemsModelMock, 'update').mockResolvedValue(systemMockInstance);
        });

        it('should return a confirmation of activation', async () => {
            const responseTest = await SystemsServicesMock.activate(systemMockInstance._id);
            expect(responseTest).toBe(`System ${systemMockInstance._id} was activated`);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SystemsServicesMock.activate(systemMockInstance._id);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });

        it('should throw an error when system is already active', async () => {
            try {
                await SystemsServicesMock.activate(systemMockInstance._id);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });
    });

    describe('When service for deactivate a system is called', () => {
        beforeAll(() => {
            jest.spyOn(SystemsModelMock, 'findOne')
                .mockResolvedValueOnce(systemMockInstanceNoActive)
                .mockResolvedValueOnce(null)
                .mockResolvedValue(systemMockInstanceNoActive);
            jest.spyOn(SystemsModelMock, 'update').mockResolvedValue(systemMockInstance);
        });

        it('should return a confirmation of deactivation', async () => {
            const responseTest = await SystemsServicesMock.deactivate(systemMockInstance._id);
            expect(responseTest).toBe(`System ${systemMockInstance._id} was deactivated`);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SystemsServicesMock.deactivate('inexistent_id');
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.code).toBe(404);
                expect(err.name).toBe('NotFound');
            }
        });

        it('should throw an error when system is already deactivated', async () => {
            try {
                await SystemsServicesMock.deactivate(systemMockInstance._id);
            } catch (error) {
                const err = error as HttpRequestErrors;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.code).toBe(400);
                expect(err.name).toBe('BadRequest');
            }
        });
    });
});
