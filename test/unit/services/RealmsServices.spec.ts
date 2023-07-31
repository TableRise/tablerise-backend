import RealmsModel from 'src/database/models/RealmsModel';
import RealmsServices from 'src/services/RealmsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Realm } from 'src/schemas/realmsValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: RealmsServices', () => {
    const RealmsModelMock = new RealmsModel();
    const RealmsServicesMock = new RealmsServices(RealmsModelMock, logger);
    const realmsMockInstance = mocks.realm.instance as Internacional<Realm>;
    const { _id: _, ...realmsMockPayload } = realmsMockInstance;

    describe('When the recover all realm service is called', () => {
        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'findAll').mockResolvedValue([realmsMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await RealmsServicesMock.findAll();
            expect(responseTest).toStrictEqual([realmsMockInstance]);
        });
    });

    describe('When the recover a realm by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'findOne').mockResolvedValueOnce(realmsMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await RealmsServicesMock.findOne(realmsMockInstance._id as string);
            expect(responseTest).toBe(realmsMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RealmsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a realm with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a realm is called', () => {
        const realmMockID = realmsMockInstance._id as string;
        const realmMockUpdateInstance = {
            en: { ...realmsMockInstance.en, name: 'None' },
            pt: { ...realmsMockInstance.pt, name: 'None' },
        };

        const { name: _1, ...realmsMockEnWithoutName } = realmsMockPayload.en;
        const { name: _2, ...realmsMockPtWithoutName } = realmsMockPayload.pt;
        const realmsMockPayloadWrong = {
            en: realmsMockEnWithoutName,
            pt: realmsMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'update')
                .mockResolvedValueOnce(realmMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await RealmsServicesMock.update(
                realmMockID,
                realmsMockPayload as Internacional<Realm>
            );
            expect(responseTest).toBe(realmMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await RealmsServicesMock.update(realmMockID, realmsMockPayloadWrong as Internacional<Realm>);
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
                await RealmsServicesMock.update('inexistent_id', realmsMockPayload as Internacional<Realm>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a realm with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a realm is called', () => {
        const realmMockID = realmsMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(RealmsModelMock, 'findOne').mockResolvedValueOnce(realmsMockInstance).mockResolvedValue(null);

            jest.spyOn(RealmsModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete realm and not return any data', async () => {
            try {
                await RealmsServicesMock.delete(realmMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await RealmsServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a realm with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
