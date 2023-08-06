import FeatsModel from 'src/database/models/FeatsModel';
import FeatsServices from 'src/services/FeatsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Feat } from 'src/schemas/featsValidationSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: FeatsServices', () => {
    const FeatsModelMock = new FeatsModel();
    const ValidateDataMock = new ValidateData(logger);
    const FeatsServicesMock = new FeatsServices(FeatsModelMock, logger, ValidateDataMock);
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
                expect(err.message).toBe('NotFound a feat with provided ID');
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
            const responseTest = await FeatsServicesMock.update(featMockID, featMockPayload as Internacional<Feat>);
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

        it('should throw an error when ID is inexistent', async () => {
            try {
                await FeatsServicesMock.update('inexistent_id', featMockPayload as Internacional<Feat>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a feat with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a feat is called', () => {
        const featMockID = featMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(FeatsModelMock, 'findOne').mockResolvedValueOnce(featMockInstance).mockResolvedValue(null);

            jest.spyOn(FeatsModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete feat and not return any data', async () => {
            try {
                await FeatsServicesMock.delete(featMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await FeatsServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a feat with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
