import DatabaseManagement, { DnDSpell, Internacional, MongoModel, SchemasDnDType } from '@tablerise/database-management';
import SpellsServices from 'src/services/dungeons&dragons5e/SpellsServices';
import mocks from 'src/support/mocks/dungeons&dragons5e';
import ValidateData from 'src/support/helpers/ValidateData';

const logger = require('@tablerise/dynamic-logger');

describe('Services :: SpellsServices', () => {
    const DM_MOCK = new DatabaseManagement();

    let SpellsModelMock: MongoModel<any>;
    let SpellsServicesMock: SpellsServices;
    let SpellsSchemaMock: SchemasDnDType;

    const ValidateDataMock = new ValidateData(logger);

    const spellMockInstance = mocks.spell.instance as Internacional<DnDSpell>;
    const { _id: _, ...spellMockPayload } = spellMockInstance;

    describe('When the recover all enabled spells service is called', () => {
        beforeAll(() => {
            SpellsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Spells', { mock: true });
            SpellsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
            SpellsServicesMock = new SpellsServices(SpellsModelMock, logger, ValidateDataMock, SpellsSchemaMock);

            jest.spyOn(SpellsModelMock, 'findAll').mockResolvedValue([spellMockInstance]);
        });

        it('should return correct data', async () => {
            const responseTest = await SpellsServicesMock.findAll();
            expect(responseTest).toStrictEqual([spellMockInstance]);
        });
    });

    describe('When the recover all disabled spells service is called', () => {
        const spellMockDisabled = { active: false, ...spellMockInstance };

        beforeAll(() => {
            SpellsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Spells', { mock: true });
            SpellsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
            SpellsServicesMock = new SpellsServices(SpellsModelMock, logger, ValidateDataMock, SpellsSchemaMock);
        
            jest.spyOn(SpellsModelMock, 'findAll').mockResolvedValue([spellMockDisabled]);
        });

        it('should return correct data', async () => {
            const responseTest = await SpellsServicesMock.findAllDisabled();
            expect(responseTest).toStrictEqual([spellMockDisabled]);
        });
    });

    describe('When the recover a spell by ID service is called', () => {
        beforeAll(() => {
            SpellsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Spells', { mock: true });
            SpellsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
            SpellsServicesMock = new SpellsServices(SpellsModelMock, logger, ValidateDataMock, SpellsSchemaMock);
        
            jest.spyOn(SpellsModelMock, 'findOne').mockResolvedValueOnce(spellMockInstance).mockResolvedValue(null);
        });

        it('should return correct data when ID valid', async () => {
            const responseTest = await SpellsServicesMock.findOne(spellMockInstance._id as string);
            expect(responseTest).toBe(spellMockInstance);
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SpellsServicesMock.findOne('inexistent_id');
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a spell with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update a spell is called', () => {
        const spellMockID = spellMockInstance._id as string;
        const spellMockUpdateInstance = {
            en: { ...spellMockInstance.en, name: 'None' },
            pt: { ...spellMockInstance.pt, name: 'None' },
        };
        const spellMockPayloadWithoutActive = { ...spellMockPayload };
        delete spellMockPayloadWithoutActive.active;

        const { name: _1, ...spellsMockEnWithoutName } = spellMockPayload.en;
        const { name: _2, ...spellsMockPtWithoutName } = spellMockPayload.pt;
        const spellMockPayloadWrong = {
            en: spellsMockEnWithoutName,
            pt: spellsMockPtWithoutName,
        };

        beforeAll(() => {
            SpellsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Spells', { mock: true });
            SpellsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
            SpellsServicesMock = new SpellsServices(SpellsModelMock, logger, ValidateDataMock, SpellsSchemaMock);

            jest.spyOn(SpellsModelMock, 'update')
                .mockResolvedValueOnce(spellMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct data with updated values', async () => {
            const responseTest = await SpellsServicesMock.update(
                spellMockID,
                spellMockPayloadWithoutActive as Internacional<DnDSpell>
            );
            expect(responseTest).toBe(spellMockUpdateInstance);
        });

        it('should throw an error when payload is incorrect', async () => {
            try {
                await SpellsServicesMock.update(spellMockID, spellMockPayloadWrong as Internacional<DnDSpell>);
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
                await SpellsServicesMock.update('inexistent_id', spellMockPayload as Internacional<DnDSpell>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Not possible to change availability through this route');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SpellsServicesMock.update('inexistent_id', spellMockPayloadWithoutActive as Internacional<DnDSpell>);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a spell with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });

    describe('When service for update availability spell is called', () => {
        const spellMockID = spellMockInstance._id as string;
        const spellMockUpdateInstance = {
            _id: spellMockID,
            active: false,
            en: { ...spellMockInstance.en },
            pt: { ...spellMockInstance.pt },
        };

        const spellMockFindInstance = {
            _id: spellMockID,
            active: true,
            en: { ...spellMockInstance.en },
            pt: { ...spellMockInstance.pt },
        };

        const responseMessageMockActivated = {
            message: `Spell ${spellMockID} was activated`,
            name: 'success',
        };

        const responseMessageMockDeactivated = {
            message: `Spell ${spellMockID} was deactivated`,
            name: 'success',
        };

        beforeAll(() => {
            SpellsModelMock = DM_MOCK.modelInstance('dungeons&dragons5e', 'Spells', { mock: true });
            SpellsSchemaMock = DM_MOCK.schemaInstance('dungeons&dragons5e');
            SpellsServicesMock = new SpellsServices(SpellsModelMock, logger, ValidateDataMock, SpellsSchemaMock);
            
            jest.spyOn(SpellsModelMock, 'findOne')
                .mockResolvedValueOnce(spellMockFindInstance)
                .mockResolvedValueOnce({ ...spellMockFindInstance, active: false })
                .mockResolvedValueOnce({ ...spellMockFindInstance, active: true })
                .mockResolvedValueOnce(spellMockUpdateInstance)
                .mockResolvedValue(null);

            jest.spyOn(SpellsModelMock, 'update')
                .mockResolvedValueOnce(spellMockUpdateInstance)
                .mockResolvedValueOnce(spellMockUpdateInstance)
                .mockResolvedValue(null);
        });

        it('should return correct success message - disable', async () => {
            const responseTest = await SpellsServicesMock.updateAvailability(spellMockID, false);
            expect(responseTest).toStrictEqual(responseMessageMockDeactivated);
        });

        it('should return correct success message - enable', async () => {
            const responseTest = await SpellsServicesMock.updateAvailability(spellMockID, true);
            expect(responseTest).toStrictEqual(responseMessageMockActivated);
        });

        it('should throw an error when the spell is already enabled', async () => {
            try {
                await SpellsServicesMock.updateAvailability(spellMockID, true);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already enabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when the spell is already disabled', async () => {
            try {
                await SpellsServicesMock.updateAvailability(spellMockID, false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('Entity already disabled');
                expect(err.stack).toBe('400');
                expect(err.name).toBe('BadRequest');
            }
        });

        it('should throw an error when ID is inexistent', async () => {
            try {
                await SpellsServicesMock.updateAvailability('inexistent_id', false);
            } catch (error) {
                const err = error as Error;
                expect(err.message).toBe('NotFound a spell with provided ID');
                expect(err.stack).toBe('404');
                expect(err.name).toBe('NotFound');
            }
        });
    });
});
