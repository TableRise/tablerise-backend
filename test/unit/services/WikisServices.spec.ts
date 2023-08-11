import WikisModel from 'src/database/models/WikisModel';
import WikisServices from 'src/services/WikisService';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Wiki } from 'src/schemas/wikisValidationSchema';
import mocks from 'src/support/mocks';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: WikisServices', () => {
    const WikisModelMock = new WikisModel();
    const ValidateDataMock = new ValidateData(logger);
    const WikisServicesMock = new WikisServices(WikisModelMock, logger, ValidateDataMock);
    const wikiMockInstance = mocks.wiki.instance as Internacional<Wiki>;
    const { _id: _, ...wikiMockPayload } = wikiMockInstance;

    describe('When the recover all enabled wikis service is called', () => {
        beforeAll(() => {
            jest.spyOn(WikisModelMock, 'findAll').mockResolvedValue([wikiMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await WikisServicesMock.findAll();
            expect(responseTest).toStrictEqual([wikiMockInstance]);
        });
    });

    describe('When the recover all disabled wikis service is called', () => {
        const wikiMockDisabled = { ...wikiMockInstance, active: false };
        beforeAll(() => {
            jest.spyOn(WikisModelMock, 'findAll').mockResolvedValue([wikiMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await WikisServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([wikiMockDisabled]);
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
        const wikiMockPayloadWithoutActive = { ...wikiMockPayload };
        delete wikiMockPayloadWithoutActive.active;

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
            const responseTest = await WikisServicesMock.update(
                wikiMockID,
                wikiMockPayloadWithoutActive as Internacional<Wiki>
            );
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

        it('should throw an error when try to update availability', async () => {
            try {
                await WikisServicesMock.update('inexistent_id', wikiMockPayload as Internacional<Wiki>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WikisServicesMock.update('inexistent_id', wikiMockPayloadWithoutActive as Internacional<Wiki>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a wiki with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability wiki is called', () => {
        const wikiMockID = wikiMockInstance._id as string;
        const wikiMockUpdateInstance = {
            _id: wikiMockID,
            active: false,
            en: { ...wikiMockInstance.en },
            pt: { ...wikiMockInstance.pt },
        };

        const wikiMockFindInstance = {
            _id: wikiMockID,
            active: true,
            en: { ...wikiMockInstance.en },
            pt: { ...wikiMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Wiki ${wikiMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Wiki ${wikiMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            jest.spyOn(WikisModelMock, 'findOne')
                .mockResolvedValueOnce(wikiMockFindInstance)
                .mockResolvedValueOnce({ ...wikiMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...wikiMockFindInstance, active: true })
                .mockResolvedValueOnce(wikiMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(WikisModelMock, 'update')
                .mockResolvedValueOnce(wikiMockUpdateInstance)
                .mockResolvedValueOnce({ ...wikiMockUpdateInstance, active: true })
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await WikisServicesMock.updateAvailability(wikiMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await WikisServicesMock.updateAvailability(wikiMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the wiki is already enabled', async () => {
            try {
                await WikisServicesMock.updateAvailability(wikiMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already enabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the wiki is already disabled', async () => {
            try {
                await WikisServicesMock.updateAvailability(wikiMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already disabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await WikisServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a wiki with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
