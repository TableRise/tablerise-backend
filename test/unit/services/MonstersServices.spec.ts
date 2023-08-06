import MonstersModel from 'src/database/models/MonstersModel';
import MonstersServices from 'src/services/MonstersServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Monster } from 'src/schemas/monstersValidationSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: MonstersServices', () => {
    const MonstersModelMock = new MonstersModel();
    const ValidateDataMock = new ValidateData(logger);
    const MonstersServicesMock = new MonstersServices(MonstersModelMock, logger, ValidateDataMock);
    const monsterMockInstance = mocks.monster.instance as Internacional<Monster>;
    const { _id: _, ...monsterMockPayload } = monsterMockInstance;

    describe('When the recover all monsters service is called', () => {
        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'findAll').mockResolvedValue([monsterMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await MonstersServicesMock.findAll();
            expect(responseTest).toStrictEqual([monsterMockInstance]);
        });
    });

    describe('When the recover a monster by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'findOne').mockResolvedValueOnce(monsterMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await MonstersServicesMock.findOne(monsterMockInstance._id as string);
            expect(responseTest).toBe(monsterMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await MonstersServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a monster with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a monster is called', () => {
        const monsterMockID = monsterMockInstance._id as string;
        const monsterMockUpdateInstance = {
            en: { ...monsterMockInstance.en, name: 'None' },
            pt: { ...monsterMockInstance.pt, name: 'None' },
        };

        const { name: _1, ...monstersMockEnWithoutName } = monsterMockPayload.en;
        const { name: _2, ...monstersMockPtWithoutName } = monsterMockPayload.pt;
        const monsterMockPayloadWrong = {
            en: monstersMockEnWithoutName,
            pt: monstersMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'update')
                .mockResolvedValueOnce(monsterMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await MonstersServicesMock.update(
                monsterMockID,
                monsterMockPayload as Internacional<Monster>
            );
            expect(responseTest).toBe(monsterMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await MonstersServicesMock.update(monsterMockID, monsterMockPayloadWrong as Internacional<Monster>);
            } catch (error) {
                const err = error as Error;
                expect(JSON.parse(err.message)[0].path).toStrictEqual(['en', 'name']);
                expect(JSON.parse(err.message)[0].message).toBe('Required');
                expect(err.stack).toBe('422');
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await MonstersServicesMock.update('inexistent_id', monsterMockPayload as Internacional<Monster>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a monster with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a monster is called', () => {
        const monsterMockID = monsterMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(MonstersModelMock, 'findOne').mockResolvedValueOnce(monsterMockInstance).mockResolvedValue(null);

            jest.spyOn(MonstersModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete monster and not return any data', async () => {
            try {
                await MonstersServicesMock.delete(monsterMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await MonstersServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a monster with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
