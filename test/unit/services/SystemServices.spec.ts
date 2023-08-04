import SystemsModel from 'src/database/models/SystemModel';
import SystemsServices from 'src/services/SystemServices';
import { System } from 'src/schemas/systemValidationSchema';
import { UpdateContent } from 'src/schemas/updateContentSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: SystemsServices', () => {
    const systemsModelMock = new SystemsModel();
    const systemsServicesMock = new SystemsServices(systemsModelMock, logger);
    const systemMockInstance = mocks.system.instance as System;
    const systemMockInstanceNoActive = { ...systemMockInstance, active: false };
    const { content: _, _id: __, ...systemMockPayload } = systemMockInstance;

    const updateContentMockInstance = mocks.updateSystemContent.instance as UpdateContent;

    describe('When the recover all system service is called', () => {
        beforeAll(() => {
            jest.spyOn(systemsModelMock, 'findAll').mockResolvedValue([systemMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await systemsServicesMock.findAll();
            expect(responseTest).toStrictEqual([systemMockInstance]);
        });
    });

    describe('When the recover a system by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(systemsModelMock, 'findOne').mockResolvedValueOnce(systemMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await systemsServicesMock.findOne(systemMockInstance._id as string);
            expect(responseTest).toBe(systemMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await systemsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a system with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a system is called', () => {
        const systemMockID = systemMockInstance._id as string;
        const systemMockUpdateInstance = {
            ...systemMockInstance,
            active: false,
            name: 'D&D',
        };

        // eslint-disable-next-line @typescript-eslint/naming-convention
        const { name: ___, ...systemMockPayloadWrong } = systemMockPayload;

        beforeAll(() => {
            jest.spyOn(systemsModelMock, 'update')
                .mockResolvedValueOnce(systemMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await systemsServicesMock.update(systemMockID, systemMockPayload as System);
            expect(responseTest).toBe(systemMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await systemsServicesMock.update(systemMockID, systemMockPayloadWrong as System);
            } catch (error) {
                const err = error as Error;
                expect(JSON.parse(err.message)[0].path[0]).toBe('name');
                expect(JSON.parse(err.message)[0].message).toBe('Required');
                expect(err.stack).toBe('422');
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await systemsServicesMock.update('inexistent_id', systemMockPayload as System);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a system with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });

        it('should throw an error when system content is given', async () => {
            try {
                await systemsServicesMock.update(systemMockID, systemMockInstance);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Update the content directly is not allowed');
                expect(err.stack).toBe('403');
                expect(err.name).toBe('ForbiddenRequest');
            }
        });
    });

    describe('When service for update a system content is called', () => {
        const { method, newID } = updateContentMockInstance;
        const systemMockID = systemMockInstance._id as string;
        const entityMockQuery = 'races';
        const { method: __, ...updateContentWithoutMethod } = updateContentMockInstance;
        const updateResult = `New ID ${newID} was ${method} to array of entities ${entityMockQuery} - system ID: ${
            systemMockInstance._id as string
        }`;

        beforeAll(() => {
            jest.spyOn(systemsModelMock, 'findOne')
                .mockResolvedValueOnce(systemMockInstance)
                .mockResolvedValueOnce(systemMockInstance)
                .mockResolvedValue(null);
            jest.spyOn(systemsModelMock, 'update').mockResolvedValue(systemMockInstance);
        });

        it('should return a confirmation of add an entity ID', async () => {
            const responseTest = await systemsServicesMock.updateContent(
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
            const updateResult = `New ID ${newID} was ${method} to array of entities ${entityMockQuery} - system ID: ${
                systemMockInstance._id as string
            }`;

            const responseTest = await systemsServicesMock.updateContent(
                systemMockID,
                entityMockQuery,
                updateContentMockInstanceRemove
            );
            expect(responseTest).toBe(updateResult);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await systemsServicesMock.updateContent(
                    systemMockID,
                    entityMockQuery,
                    updateContentWithoutMethod as UpdateContent
                );
            } catch (error) {
                const err = error as Error;
                expect(JSON.parse(err.message)[0].path[0]).toBe('method');
                expect(JSON.parse(err.message)[0].message).toBe('Required');
                expect(err.stack).toBe('422');
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when there is no entityQuery', async () => {
            try {
                await systemsServicesMock.updateContent(
                    systemMockID,
                    undefined as unknown as string,
                    updateContentMockInstance
                );
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('An entity name is required');
                expect(err.stack).toBe('422');
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await systemsServicesMock.updateContent('inexistent_id', entityMockQuery, updateContentMockInstance);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a system with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for activate a system is called', () => {
        beforeAll(() => {
            jest.spyOn(systemsModelMock, 'findOne')
                .mockResolvedValueOnce(systemMockInstanceNoActive)
                .mockResolvedValueOnce(null)
                .mockResolvedValue(systemMockInstanceNoActive);
            jest.spyOn(systemsModelMock, 'update').mockResolvedValue(systemMockInstance);
        });

        it('should return a confirmation of activation', async () => {
            const responseTest = await systemsServicesMock.activate(systemMockInstance._id as string);
            expect(responseTest).toBe(`System ${systemMockInstance._id as string} was activated`);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await systemsServicesMock.activate(systemMockInstance._id as string);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a system with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });

        it('should throw an error when system is already active', async () => {
            try {
                await systemsServicesMock.activate(systemMockInstance._id as string);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('System already active');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('ValidationError');
            }
        });
    });

    describe('When service for deactivate a system is called', () => {
        beforeAll(() => {
            jest.spyOn(systemsModelMock, 'findOne')
                .mockResolvedValueOnce(systemMockInstanceNoActive)
                .mockResolvedValueOnce(null)
                .mockResolvedValue(systemMockInstanceNoActive);
            jest.spyOn(systemsModelMock, 'update').mockResolvedValue(systemMockInstance);
        });

        it('should return a confirmation of deactivation', async () => {
            const responseTest = await systemsServicesMock.deactivate(systemMockInstance._id as string);
            expect(responseTest).toBe(`System ${systemMockInstance._id as string} was deactivated`);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await systemsServicesMock.deactivate('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a system with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });

        it('should throw an error when system is already deactivated', async () => {
            try {
                await systemsServicesMock.deactivate(systemMockInstance._id as string);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('System already deactivated');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('ValidationError');
            }
        });
    });
});
