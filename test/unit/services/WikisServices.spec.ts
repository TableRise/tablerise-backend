import WikisModel from 'src/database/models/WikisModel';
import WikisServices from 'src/services/WikisService';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import mocks from 'src/support/mocks';

describe('Services :: WikisServices', () => {
    const WikisModelMock = new WikisModel();
    const WikisServicesMock = new WikisServices(WikisModelMock);
    const wikiMockInstance = mocks.wiki.instance as Internacional<Wiki>;
    const { _id: _, ...wikiMockPayload } = wikiMockInstance;

    describe('When the recover all wikis service is called', () => {
        beforeAll(() => {
            jest.spyOn(WikisModelMock, 'findAll').mockResolvedValue([wikiMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await WikisServicesMock.findAll();
            expect(responseTest).toStrictEqual([wikiMockInstance]);
        });
    });

    describe('When the recover a wiki by ID service is called', () => {
        beforeAll(() => {
            jest.spyOn(WikisModelMock, 'findOne').mockResolvedValueOnce(wikiMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await WikisServicesMock.findOne(wikiMockInstance._id as string);
            expect(responseTest).toBe(wikiMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WikisServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a wiki with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a wiki is called', () => {
        const wikiMockID = wikiMockInstance._id as string;
        const wikiMockUpdateInstance = {
            en: { ...wikiMockInstance.en, title: 'None' },
            pt: { ...wikiMockInstance.pt, title: 'None' },
        };

        const { title: _1, ...wikisMockEnWithoutTitle } = wikiMockPayload.en;
        const { title: _2, ...wikisMockPtWithoutTitle } = wikiMockPayload.pt;
        const wikiMockPayloadWrong = {
            en: wikisMockEnWithoutTitle,
            pt: wikisMockPtWithoutTitle,
        };

        beforeAll(() => {
            jest.spyOn(WikisModelMock, 'update').mockResolvedValueOnce(wikiMockUpdateInstance).mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await WikisServicesMock.update(wikiMockID, wikiMockPayload as Internacional<Wiki>);
            expect(responseTest).toBe(wikiMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await WikisServicesMock.update(wikiMockID, wikiMockPayloadWrong as Internacional<Wiki>);
            } catch (error) {
                const err = error as Error;
                expect(JSON.parse(err.message)[0].path).toStrictEqual(['en', 'title']);
                expect(JSON.parse(err.message)[0].message).toBe('Required');
                expect(err.stack).toBe('422');
                expect(err.name).toBe('ValidationError');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WikisServicesMock.update('inexistent_id', wikiMockPayload as Internacional<Wiki>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a wiki with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for delete a wiki is called', () => {
        const wikiMockID = wikiMockInstance._id as string;

        beforeAll(() => {
            jest.spyOn(WikisModelMock, 'findOne').mockResolvedValueOnce(wikiMockInstance).mockResolvedValue(null);

            jest.spyOn(WikisModelMock, 'delete').mockResolvedValue(null);
        });

        it('should delete wiki and not return any data', async () => {
            try {
                await WikisServicesMock.delete(wikiMockID);
            } catch (error) {
                fail('it should not reach here');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WikisServicesMock.delete('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a wiki with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
