import GodsModel from 'src/database/models/GodsModel';
import GodsServices from 'src/services/GodsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { God } from 'src/schemas/godsValidationSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: GodsServices', () => {
    const GodsModelMock = new GodsModel();
    const ValidateDataMock = new ValidateData(logger);
    const GodsServicesMock = new GodsServices(GodsModelMock, logger, ValidateDataMock);
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
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
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
                const err = error as Error;
                expect(JSON.parse(err.message)[0].path).toStrictEqual(['en', 'name']);
                expect(JSON.parse(err.message)[0].message).toBe('Required');
                expect(err.stack).toBe('422');
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when try to update availability', async () => {
            try {
                await GodsServicesMock.update('inexistent_id', godMockPayload as Internacional<God>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await GodsServicesMock.update('inexistent_id', godMockPayloadWithoutActive as Internacional<God>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
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
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the god is already disabled', async () => {
            try {
                await GodsServicesMock.updateAvailability(godMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await GodsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound an object with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
