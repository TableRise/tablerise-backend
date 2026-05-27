import { Router } from 'express';
import sinon from 'sinon';
import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';

interface InterfaceModuleMetadata {
    folder: string;
    controllerName: string;
    routesName: string;
    basePath: string;
    tag: string;
    singularOperation: string;
    pluralOperation: string;
    disabledOperation: string;
    toggleOperation: string;
    controllerDependency: string;
    extraOperation?: string;
}

const interfaceModules: InterfaceModuleMetadata[] = [
    {
        folder: 'backgrounds',
        controllerName: 'BackgroundsController',
        routesName: 'BackgroundsRoutes',
        basePath: '/system/dnd5e/backgrounds',
        tag: 'backgrounds',
        singularOperation: 'getBackgroundOperation',
        pluralOperation: 'getAllBackgroundsOperation',
        disabledOperation: 'getDisabledBackgroundsOperation',
        toggleOperation: 'toggleBackgroundsAvailabilityOperation',
        controllerDependency: 'backgroundsController',
    },
    {
        folder: 'classes',
        controllerName: 'ClassesController',
        routesName: 'ClassesRoutes',
        basePath: '/system/dnd5e/classes',
        tag: 'classes',
        singularOperation: 'getClassOperation',
        pluralOperation: 'getAllClassesOperation',
        disabledOperation: 'getDisabledClassesOperation',
        toggleOperation: 'toggleClassesAvailabilityOperation',
        controllerDependency: 'classesController',
    },
    {
        folder: 'equipment',
        controllerName: 'EquipmentController',
        routesName: 'EquipmentRoutes',
        basePath: '/system/dnd5e/equipment',
        tag: 'equipment',
        singularOperation: 'getEquipmentOperation',
        pluralOperation: 'getAllEquipmentOperation',
        disabledOperation: 'getDisabledEquipmentOperation',
        toggleOperation: 'toggleEquipmentAvailabilityOperation',
        controllerDependency: 'equipmentController',
    },
    {
        folder: 'feats',
        controllerName: 'FeatsController',
        routesName: 'FeatsRoutes',
        basePath: '/system/dnd5e/feats',
        tag: 'feats',
        singularOperation: 'getFeatOperation',
        pluralOperation: 'getAllFeatsOperation',
        disabledOperation: 'getDisabledFeatsOperation',
        toggleOperation: 'toggleFeatsAvailabilityOperation',
        controllerDependency: 'featsController',
    },
    {
        folder: 'races',
        controllerName: 'RacesController',
        routesName: 'RacesRoutes',
        basePath: '/system/dnd5e/races',
        tag: 'races',
        singularOperation: 'getRaceOperation',
        pluralOperation: 'getAllRacesOperation',
        disabledOperation: 'getDisabledRacesOperation',
        toggleOperation: 'toggleRacesAvailabilityOperation',
        controllerDependency: 'racesController',
    },
    {
        folder: 'spells',
        controllerName: 'SpellsController',
        routesName: 'SpellsRoutes',
        basePath: '/system/dnd5e/spells',
        tag: 'spells',
        singularOperation: 'getSpellOperation',
        pluralOperation: 'getAllSpellsOperation',
        disabledOperation: 'getDisabledSpellsOperation',
        toggleOperation: 'toggleSpellsAvailabilityOperation',
        controllerDependency: 'spellsController',
        extraOperation: 'getByLevelOperation',
    },
];

describe('Coverage :: DungeonsAndDragons5e :: Interface', () => {
    interfaceModules.forEach((metadata) => {
        const Controller = require(`src/interface/dungeons&dragons5e/presentation/${metadata.folder}/${metadata.controllerName}`)
            .default;
        const Routes = require(`src/interface/dungeons&dragons5e/presentation/${metadata.folder}/${metadata.routesName}`)
            .default;

        it(`should cover ${metadata.folder} controller and routes`, async () => {
            const singularStub = sinon.stub().resolves({ id: 'entity-1' });
            const pluralStub = sinon.stub().resolves([{ id: 'entity-1' }]);
            const disabledStub = sinon.stub().resolves([{ id: 'disabled-1' }]);
            const toggleStub = sinon.stub().resolves({ id: 'entity-1', active: true });
            const getByLevelStub = sinon.stub().resolves([{ id: 'spell-1', level: 3 }]);

            const controllerDependencies: Record<string, unknown> = {
                [metadata.singularOperation]: { execute: singularStub },
                [metadata.pluralOperation]: { execute: pluralStub },
                [metadata.disabledOperation]: { execute: disabledStub },
                [metadata.toggleOperation]: { execute: toggleStub },
            };

            if (metadata.extraOperation) {
                controllerDependencies[metadata.extraOperation] = { execute: getByLevelStub };
            }

            const controller = new Controller(controllerDependencies as any);
            const response = {
                status: sinon.stub().returnsThis(),
                json: sinon.stub().returnsThis(),
            };

            await controller.get({ params: { id: 'entity-1' } } as any, response as any);
            await controller.getAll({} as any, response as any);
            await controller.getDisabled({} as any, response as any);
            await controller.toggleAvailability(
                { params: { id: 'entity-1' }, query: { availability: 'true' } } as any,
                response as any
            );

            expect(singularStub).to.have.been.calledWith('entity-1');
            expect(pluralStub).to.have.been.called();
            expect(disabledStub).to.have.been.called();
            expect(toggleStub).to.have.been.calledWith({ id: 'entity-1', availability: true });
            expect(response.status).to.have.been.calledWith(HttpStatusCode.OK);

            if (metadata.extraOperation) {
                await controller.getByLevel({ query: { queryLevel: '3' } } as any, response as any);
                expect(getByLevelStub).to.have.been.calledWith(3);
            }

            const routes = new Routes({
                [metadata.controllerDependency]: controller,
                verifyIdMiddleware: 'verify-id',
            } as any);

            const declaredRoutes = routes.routes();
            expect(declaredRoutes[0].path).to.equal(metadata.basePath);
            expect(declaredRoutes[0].options.tag).to.equal(metadata.tag);
            expect(declaredRoutes.some((route: { path: string }) => route.path === `${metadata.basePath}/disabled`)).to.equal(
                true
            );
            expect(declaredRoutes.some((route: { path: string }) => route.path === `${metadata.basePath}/:id`)).to.equal(
                true
            );
            expect(declaredRoutes.some((route: { method: string }) => route.method === 'patch')).to.equal(true);

            if (metadata.extraOperation) {
                expect(
                    declaredRoutes.some((route: { path: string }) => route.path === `${metadata.basePath}/by-level`)
                ).to.equal(true);
            }
        });
    });

    it('should cover the D&D routes builder and middleware', () => {
        const DungeonsAndDragonsRoutesBuilder =
            require('src/interface/dungeons&dragons5e/DungeonsAndDragonsRoutesBuilder').default;
        const DungeonsAndDragonsRoutesMiddleware =
            require('src/interface/dungeons&dragons5e/middlewares/DungeonsAndDragonsRoutesMiddleware').default;

        const routeFactory = (name: string) => ({
            routes: sinon.stub().returns([{ method: 'get', path: `/test/${name}`, controller: sinon.stub(), options: {} }]),
        });

        const builder = new DungeonsAndDragonsRoutesBuilder({
            backgroundsRoutes: routeFactory('backgrounds'),
            classesRoutes: routeFactory('classes'),
            equipmentRoutes: routeFactory('equipment'),
            featsRoutes: routeFactory('feats'),
            racesRoutes: routeFactory('races'),
            spellsRoutes: routeFactory('spells'),
        } as any);

        const { dungeonsAndDragonsSwagger, dungeonsAndDragonsRoutes } = builder.get();
        expect(dungeonsAndDragonsSwagger).to.have.lengthOf(6);
        expect(Object.keys(dungeonsAndDragonsRoutes)).to.deep.equal([
            'backgrounds',
            'classes',
            'equipment',
            'feats',
            'races',
            'spells',
        ]);

        const middleware = new DungeonsAndDragonsRoutesMiddleware({
            routesWrapper: {
                routes: () => ({
                    'dungeons&dragons5e': {
                        backgrounds: Router(),
                        classes: Router(),
                        feats: Router(),
                        races: Router(),
                        equipment: Router(),
                        spells: Router(),
                    },
                }),
            },
        } as any);

        expect(middleware.get()).to.be.a('function');
    });
});
