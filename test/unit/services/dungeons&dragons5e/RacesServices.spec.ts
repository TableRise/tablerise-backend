import DatabaseManagement, { DnDRace, Internacional } from '@tablerise/database-management';
import RacesServices from 'src/services/dungeons&dragons5e/RacesServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: RacesServices', () => {
    const DM_MOCK = new DatabaseManagement();

    const ValidateDataMock = new ValidateData(logger);

    const RacesModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Races');
    const RacesSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
    const RacesServicesMock = new RacesServices(RacesModelMock, logger, ValidateDataMock, RacesSchemaMock);

    const racesMockInstance = mocks.race.instance as Internacional<DnDRace>;
    const { _id: _, ...racesMockPayload } = racesMockInstance;

    describe('When the recover all race service is called', () => {
        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findAll').mockResolvedValue([racesMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await RacesServicesMock.findAll();
            expect(responseTest).toStrictEqual([racesMockInstance]);
        });
    });

    describe('When the recover all disabled races service is called', () => {
        const raceMockDisabled = { ...racesMockInstance, active: false };

        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findAll').mockResolvedValue([raceMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await RacesServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([raceMockDisabled]);
        });
    });

    describe('When the recover a race by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findOne').mockResolvedValueOnce(racesMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await RacesServicesMock.findOne(racesMockInstance._id as string);
            expect(responseTest).toBe(racesMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RacesServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a race with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a race is called', () => {
        const raceMockID = racesMockInstance._id as string;
        const raceMockUpdateInstance = {
            en: { ...racesMockInstance.en, name: 'None' },
            pt: { ...racesMockInstance.pt, name: 'None' },
        };

        const raceMockPayloadWithoutActive = { ...racesMockPayload };
        delete raceMockPayloadWithoutActive.active;

        const { name: _1, ...racesMockEnWithoutName } = racesMockPayload.en;
        const { name: _2, ...racesMockPtWithoutName } = racesMockPayload.pt;
        const raceMockPayloadWrong = {
            en: racesMockEnWithoutName,
            pt: racesMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'update').mockResolvedValueOnce(raceMockUpdateInstance).mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await RacesServicesMock.update(
                raceMockID,
                raceMockPayloadWithoutActive as Internacional<DnDRace>
            );
            expect(responseTest).toBe(raceMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await RacesServicesMock.update(raceMockID, raceMockPayloadWrong as Internacional<DnDRace>);
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
                await RacesServicesMock.update('inexistent_id', racesMockPayload as Internacional<DnDRace>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RacesServicesMock.update('inexistent_id', raceMockPayloadWithoutActive as Internacional<DnDRace>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a race with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability race is called', () => {
        const raceMockID = racesMockInstance._id as string;
        const raceMockUpdateInstance = {
            _id: raceMockID,
            active: false,
            en: { ...racesMockInstance.en },
            pt: { ...racesMockInstance.pt },
        };

        const raceMockFindInstance = {
            _id: raceMockID,
            active: true,
            en: { ...racesMockInstance.en },
            pt: { ...racesMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Race ${raceMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Race ${raceMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(RacesModelMock, 'findOne')
                .mockResolvedValueOnce(raceMockFindInstance)
                .mockResolvedValueOnce({ ...raceMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...raceMockFindInstance, active: true })
                .mockResolvedValueOnce(raceMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(RacesModelMock, 'update')
                .mockResolvedValueOnce(raceMockUpdateInstance)
                .mockResolvedValueOnce({ ...raceMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await RacesServicesMock.updateAvailability(raceMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await RacesServicesMock.updateAvailability(raceMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the race is already enabled', async () => {
            try {
                await RacesServicesMock.updateAvailability(raceMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already enabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the race is already disabled', async () => {
            try {
                await RacesServicesMock.updateAvailability(raceMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already disabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RacesServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a race with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
