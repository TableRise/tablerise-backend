import sinon from 'sinon';
import GetAllBackgroundsService from 'src/core/dungeons&dragons5e/services/backgrounds/GetAllBackgroundsService';
import GetBackgroundService from 'src/core/dungeons&dragons5e/services/backgrounds/GetBackgroundService';
import GetDisabledBackgroundsService from 'src/core/dungeons&dragons5e/services/backgrounds/GetDisabledBackgroundsService';
import ToggleBackgroundsAvailabilityService from 'src/core/dungeons&dragons5e/services/backgrounds/ToggleBackgroundsAvailabilityService';
import GetAllBackgroundsOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetAllBackgroundsOperation';
import GetBackgroundOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetBackgroundOperation';
import GetDisabledBackgroundsOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/GetDisabledBackgroundsOperation';
import ToggleBackgroundsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/backgrounds/ToggleBackgroundsAvailabilityOperation';
import GetAllClassesService from 'src/core/dungeons&dragons5e/services/classes/GetAllClassesService';
import GetClassService from 'src/core/dungeons&dragons5e/services/classes/GetClassService';
import GetDisabledClassesService from 'src/core/dungeons&dragons5e/services/classes/GetDisabledClassesService';
import ToggleClassesAvailabilityService from 'src/core/dungeons&dragons5e/services/classes/ToggleClassesAvailabilityService';
import GetAllClassesOperation from 'src/core/dungeons&dragons5e/operations/classes/GetAllClassesOperation';
import GetClassOperation from 'src/core/dungeons&dragons5e/operations/classes/GetClassOperation';
import GetDisabledClassesOperation from 'src/core/dungeons&dragons5e/operations/classes/GetDisabledClassesOperation';
import ToggleClassesAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/classes/ToggleClassesAvailabilityOperation';
import GetAllEquipmentService from 'src/core/dungeons&dragons5e/services/equipment/GetAllEquipmentService';
import GetEquipmentService from 'src/core/dungeons&dragons5e/services/equipment/GetEquipmentService';
import GetDisabledEquipmentService from 'src/core/dungeons&dragons5e/services/equipment/GetDisabledEquipmentService';
import ToggleEquipmentAvailabilityService from 'src/core/dungeons&dragons5e/services/equipment/ToggleEquipmentAvailabilityService';
import GetAllEquipmentOperation from 'src/core/dungeons&dragons5e/operations/equipment/GetAllEquipmentOperation';
import GetEquipmentOperation from 'src/core/dungeons&dragons5e/operations/equipment/GetEquipmentOperation';
import GetDisabledEquipmentOperation from 'src/core/dungeons&dragons5e/operations/equipment/GetDisabledEquipmentOperation';
import ToggleEquipmentAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/equipment/ToggleEquipmentAvailabilityOperation';
import GetAllFeatsService from 'src/core/dungeons&dragons5e/services/feats/GetAllFeatsService';
import GetFeatService from 'src/core/dungeons&dragons5e/services/feats/GetFeatService';
import GetDisabledFeatsService from 'src/core/dungeons&dragons5e/services/feats/GetDisabledFeatsService';
import ToggleFeatsAvailabilityService from 'src/core/dungeons&dragons5e/services/feats/ToggleFeatsAvailabilityService';
import GetAllFeatsOperation from 'src/core/dungeons&dragons5e/operations/feats/GetAllFeatsOperation';
import GetFeatOperation from 'src/core/dungeons&dragons5e/operations/feats/GetFeatOperation';
import GetDisabledFeatsOperation from 'src/core/dungeons&dragons5e/operations/feats/GetDisabledFeatsOperation';
import ToggleFeatsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/feats/ToggleFeatsAvailabilityOperation';
import GetAllRacesService from 'src/core/dungeons&dragons5e/services/races/GetAllRacesService';
import GetRaceService from 'src/core/dungeons&dragons5e/services/races/GetRaceService';
import GetDisabledRacesService from 'src/core/dungeons&dragons5e/services/races/GetDisabledRacesService';
import ToggleRacesAvailabilityService from 'src/core/dungeons&dragons5e/services/races/ToggleRacesAvailabilityService';
import GetAllRacesOperation from 'src/core/dungeons&dragons5e/operations/races/GetAllRacesOperation';
import GetRaceOperation from 'src/core/dungeons&dragons5e/operations/races/GetRaceOperation';
import GetDisabledRacesOperation from 'src/core/dungeons&dragons5e/operations/races/GetDisabledRacesOperation';
import ToggleRacesAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/races/ToggleRacesAvailabilityOperation';
import GetAllSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetAllSpellsService';
import GetSpellService from 'src/core/dungeons&dragons5e/services/spells/GetSpellService';
import GetDisabledSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetDisabledSpellsService';
import GetByLevelSpellsService from 'src/core/dungeons&dragons5e/services/spells/GetByLevelSpellsService';
import ToggleSpellsAvailabilityService from 'src/core/dungeons&dragons5e/services/spells/ToggleSpellsAvailabilityService';
import GetAllSpellsOperation from 'src/core/dungeons&dragons5e/operations/spells/GetAllSpellsOperation';
import GetSpellOperation from 'src/core/dungeons&dragons5e/operations/spells/GetSpellOperation';
import GetDisabledSpellsOperation from 'src/core/dungeons&dragons5e/operations/spells/GetDisabledSpellsOperation';
import GetByLevelOperation from 'src/core/dungeons&dragons5e/operations/spells/GetByLevelOperation';
import ToggleSpellsAvailabilityOperation from 'src/core/dungeons&dragons5e/operations/spells/ToggleSpellsAvailabilityOperation';
import classesEnum from 'src/domains/dungeons&dragons5e/enums/classesEnum';
import racesEnum from 'src/domains/dungeons&dragons5e/enums/racesEnum';

const logger = (): void => {};

interface StandardCoverageCase {
    name: string;
    entity: string;
    idKey: string;
    GetAllService: any;
    GetService: any;
    GetDisabledService: any;
    ToggleService: any;
    GetAllOperation: any;
    GetOperation: any;
    GetDisabledOperation: any;
    ToggleOperation: any;
    getAllServiceKey: string;
    getServiceKey: string;
    getDisabledServiceKey: string;
    toggleServiceKey: string;
}

const standardCoverageCases: StandardCoverageCase[] = [
    {
        name: 'Backgrounds',
        entity: 'Backgrounds',
        idKey: 'backgroundId',
        GetAllService: GetAllBackgroundsService,
        GetService: GetBackgroundService,
        GetDisabledService: GetDisabledBackgroundsService,
        ToggleService: ToggleBackgroundsAvailabilityService,
        GetAllOperation: GetAllBackgroundsOperation,
        GetOperation: GetBackgroundOperation,
        GetDisabledOperation: GetDisabledBackgroundsOperation,
        ToggleOperation: ToggleBackgroundsAvailabilityOperation,
        getAllServiceKey: 'getAllBackgroundsService',
        getServiceKey: 'getBackgroundService',
        getDisabledServiceKey: 'getDisabledBackgroundsService',
        toggleServiceKey: 'toggleBackgroundsAvailabilityService',
    },
    {
        name: 'Classes',
        entity: 'Classes',
        idKey: 'classId',
        GetAllService: GetAllClassesService,
        GetService: GetClassService,
        GetDisabledService: GetDisabledClassesService,
        ToggleService: ToggleClassesAvailabilityService,
        GetAllOperation: GetAllClassesOperation,
        GetOperation: GetClassOperation,
        GetDisabledOperation: GetDisabledClassesOperation,
        ToggleOperation: ToggleClassesAvailabilityOperation,
        getAllServiceKey: 'getAllClassesService',
        getServiceKey: 'getClassService',
        getDisabledServiceKey: 'getDisabledClassesService',
        toggleServiceKey: 'toggleClassesAvailabilityService',
    },
    {
        name: 'Equipment',
        entity: 'Equipment',
        idKey: 'equipmentId',
        GetAllService: GetAllEquipmentService,
        GetService: GetEquipmentService,
        GetDisabledService: GetDisabledEquipmentService,
        ToggleService: ToggleEquipmentAvailabilityService,
        GetAllOperation: GetAllEquipmentOperation,
        GetOperation: GetEquipmentOperation,
        GetDisabledOperation: GetDisabledEquipmentOperation,
        ToggleOperation: ToggleEquipmentAvailabilityOperation,
        getAllServiceKey: 'getAllEquipmentService',
        getServiceKey: 'getEquipmentService',
        getDisabledServiceKey: 'getDisabledEquipmentService',
        toggleServiceKey: 'toggleEquipmentAvailabilityService',
    },
    {
        name: 'Feats',
        entity: 'Feats',
        idKey: 'featId',
        GetAllService: GetAllFeatsService,
        GetService: GetFeatService,
        GetDisabledService: GetDisabledFeatsService,
        ToggleService: ToggleFeatsAvailabilityService,
        GetAllOperation: GetAllFeatsOperation,
        GetOperation: GetFeatOperation,
        GetDisabledOperation: GetDisabledFeatsOperation,
        ToggleOperation: ToggleFeatsAvailabilityOperation,
        getAllServiceKey: 'getAllFeatsService',
        getServiceKey: 'getFeatService',
        getDisabledServiceKey: 'getDisabledFeatsService',
        toggleServiceKey: 'toggleFeatsAvailabilityService',
    },
    {
        name: 'Races',
        entity: 'Races',
        idKey: 'raceId',
        GetAllService: GetAllRacesService,
        GetService: GetRaceService,
        GetDisabledService: GetDisabledRacesService,
        ToggleService: ToggleRacesAvailabilityService,
        GetAllOperation: GetAllRacesOperation,
        GetOperation: GetRaceOperation,
        GetDisabledOperation: GetDisabledRacesOperation,
        ToggleOperation: ToggleRacesAvailabilityOperation,
        getAllServiceKey: 'getAllRacesService',
        getServiceKey: 'getRaceService',
        getDisabledServiceKey: 'getDisabledRacesService',
        toggleServiceKey: 'toggleRacesAvailabilityService',
    },
];

describe('Coverage :: DungeonsAndDragons5e :: Core', () => {
    standardCoverageCases.forEach((testCase) => {
        it(`should cover ${testCase.name} services and operations`, async () => {
            const payload = { [testCase.idKey]: 'entity-1', active: false } as Record<string, unknown>;
            const repository = {
                setEntity: sinon.stub(),
                find: sinon.stub().resolves([payload]),
                findOne: sinon.stub().resolves({ ...payload }),
                update: sinon.stub().resolves({ ...payload, active: true }),
            };

            const getAllService = new testCase.GetAllService({ dungeonsAndDragonsRepository: repository, logger } as any);
            const getService = new testCase.GetService({ dungeonsAndDragonsRepository: repository, logger } as any);
            const getDisabledService = new testCase.GetDisabledService({
                dungeonsAndDragonsRepository: repository,
                logger,
            } as any);
            const toggleService = new testCase.ToggleService({ dungeonsAndDragonsRepository: repository, logger } as any);

            expect(await getAllService.getAll()).to.deep.equal([payload]);
            expect(await getService.get('entity-1')).to.deep.equal(payload);
            expect(await getDisabledService.getAllDisabled()).to.deep.equal([payload]);
            expect(await toggleService.toggle({ id: 'entity-1', availability: true })).to.deep.equal({
                ...payload,
                active: true,
            });

            expect(repository.setEntity).to.have.been.calledWith(testCase.entity);
            expect(repository.find).to.have.been.calledWith({ active: true });
            expect(repository.find).to.have.been.calledWith({ active: false });
            expect(repository.findOne).to.have.been.calledWith({ [testCase.idKey]: 'entity-1' });
            expect(repository.update).to.have.been.calledWith({
                query: { [testCase.idKey]: 'entity-1' },
                payload: { ...payload, active: true },
            });

            const getAllServiceStub = { getAll: sinon.stub().resolves([payload]) };
            const getServiceStub = { get: sinon.stub().resolves(payload) };
            const getDisabledServiceStub = { getAllDisabled: sinon.stub().resolves([payload]) };
            const toggleServiceStub = { toggle: sinon.stub().resolves({ ...payload, active: true }) };

            const getAllOperation = new testCase.GetAllOperation({
                [testCase.getAllServiceKey]: getAllServiceStub,
                logger,
            } as any);
            const getOperation = new testCase.GetOperation({
                [testCase.getServiceKey]: getServiceStub,
                logger,
            } as any);
            const getDisabledOperation = new testCase.GetDisabledOperation({
                [testCase.getDisabledServiceKey]: getDisabledServiceStub,
                logger,
            } as any);
            const toggleOperation = new testCase.ToggleOperation({
                [testCase.toggleServiceKey]: toggleServiceStub,
                logger,
            } as any);

            expect(await getAllOperation.execute()).to.deep.equal([payload]);
            expect(await getOperation.execute('entity-1')).to.deep.equal(payload);
            expect(await getDisabledOperation.execute()).to.deep.equal([payload]);
            expect(await toggleOperation.execute({ id: 'entity-1', availability: true })).to.deep.equal({
                ...payload,
                active: true,
            });
        });
    });

    it('should cover spell services and operations including level filtering', async () => {
        const payload = { spellId: 'spell-1', active: false };
        const repository = {
            setEntity: sinon.stub(),
            find: sinon.stub().callsFake(async (query) => [{ ...payload, ...query }]),
            findOne: sinon.stub().resolves({ ...payload }),
            update: sinon.stub().resolves({ ...payload, active: true }),
        };

        const getAllService = new GetAllSpellsService({ dungeonsAndDragonsRepository: repository, logger } as any);
        const getService = new GetSpellService({ dungeonsAndDragonsRepository: repository, logger } as any);
        const getDisabledService = new GetDisabledSpellsService({
            dungeonsAndDragonsRepository: repository,
            logger,
        } as any);
        const getByLevelService = new GetByLevelSpellsService({
            dungeonsAndDragonsRepository: repository,
            logger,
        } as any);
        const toggleService = new ToggleSpellsAvailabilityService({
            dungeonsAndDragonsRepository: repository,
            logger,
        } as any);

        expect(await getAllService.getAll()).to.deep.equal([{ ...payload, active: true }]);
        expect(await getService.get('spell-1')).to.deep.equal(payload);
        expect(await getDisabledService.getAllDisabled()).to.deep.equal([{ ...payload, active: false }]);
        expect(await getByLevelService.getByLevel('3')).to.deep.equal([{ ...payload, level: '3' }]);
        expect(await toggleService.toggle({ id: 'spell-1', availability: true })).to.deep.equal({
            ...payload,
            active: true,
        });

        const getAllSpellsService = { getAll: sinon.stub().resolves([payload]) };
        const getSpellService = { get: sinon.stub().resolves(payload) };
        const getDisabledSpellsService = { getAllDisabled: sinon.stub().resolves([payload]) };
        const getByLevelSpellsService = { getByLevel: sinon.stub().resolves([payload]) };
        const toggleSpellsAvailabilityService = { toggle: sinon.stub().resolves({ ...payload, active: true }) };

        expect(await new GetAllSpellsOperation({ getAllSpellsService, logger } as any).execute()).to.deep.equal([
            payload,
        ]);
        expect(await new GetSpellOperation({ getSpellService, logger } as any).execute('spell-1')).to.deep.equal(
            payload
        );
        expect(
            await new GetDisabledSpellsOperation({ getDisabledSpellsService, logger } as any).execute()
        ).to.deep.equal([payload]);
        expect(await new GetByLevelOperation({ getByLevelSpellsService, logger } as any).execute('3')).to.deep.equal([
            payload,
        ]);
        expect(
            await new ToggleSpellsAvailabilityOperation({ toggleSpellsAvailabilityService, logger } as any).execute({
                id: 'spell-1',
                availability: true,
            })
        ).to.deep.equal({ ...payload, active: true });
    });

    it('should expose the D&D enum values', () => {
        expect(classesEnum.values).to.include('Wizard');
        expect(classesEnum.enum.BARBARIAN).to.equal('Barbarian');
        expect(racesEnum.values).to.include('Dragonborn');
        expect(racesEnum.enum.HUMAN).to.equal('Human');
    });
});
