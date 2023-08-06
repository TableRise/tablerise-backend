import GodsModel from 'src/database/models/GodsModel';
import GodsServices from 'src/services/GodsServices';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { God } from 'src/schemas/godsValidationSchema';
import mocks from 'src/support/mocks';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: GodsServices', () => {
    const GodsModelMock = new GodsModel();
    const GodsServicesMock = new GodsServices(GodsModelMock, logger);
    const godMockInstance = mocks.god.instance as Internacional<God>;
    const { _id: _, ...godMockPayload } = godMockInstance;

    describe('When the recover all gods service is called', () => {
        beforeAll(() => {
            jest.spyOn(GodsModelMock, 'findAll').mockResolvedValue([godMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await GodsServicesMock.findAll();
            expect(responseTest).toStrictEqual([godMockInstance]);
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
                expect(err.message).toBe('NotFound a god with provided ID');
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

        const { name: _1, ...godMockEnWithoutName } = godMockPayload.en;
        const { name: _2, ...godMockPtWithoutName } = godMockPayload.pt;
        const godMockPayloadWrong = {
            en: godMockEnWithoutName,
            pt: godMockPtWithoutName,
        };

        beforeAll(() => {
            jest.spyOn(GodsModelMock, 'update').mockResolvedValueOnce(godMockUpdateInstance).mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await GodsServicesMock.update(godMockID, godMockPayload as Internacional<God>);
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

        it('should throw an error when ID is inexistent', async () => {
            try {
                await GodsServicesMock.update('inexistent_id', godMockPayload as Internacional<God>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a god with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a god is called', () => {
        const godMockID = godMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(GodsModelMock, 'findOne').mockResolvedValueOnce(godMockInstance).mockResolvedValue(null);

            jest.spyOn(GodsModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete god and not return any data', async () => {
            try {
                await GodsServicesMock.delete(godMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await GodsServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a god with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
