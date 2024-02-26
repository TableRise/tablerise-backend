import { routeInstance } from '@tablerise/auto-swagger';
import { Router } from 'express';
import passport from 'passport';
import generateIDParam, {
    generateQueryParam,
} from 'src/domains/common/helpers/parametersWrapper';
import DungeonsAndDragonsRoutesBuilder from 'src/interface/dungeons&dragons5e/DungeonsAndDragonsRoutesBuilder';

describe('Interface :: DungeonsAndDragons :: Presentation :: DungeonsAndDragonsRoutesMiddleware', () => {
    let dungeonsAndDragonsRoutesBuilder: DungeonsAndDragonsRoutesBuilder,
        verifyIdMiddleware: any,
        armorsRoutes: any,
        backgroundsRoutes: any,
        classesRoutes: any,
        featsRoutes: any,
        godsRoutes: any,
        itemsRoutes: any,
        racesRoutes: any,
        realmsRoutes: any,
        magicItemsRoutes: any,
        monstersRoutes: any,
        spellsRoutes: any,
        weaponsRoutes: any,
        wikisRoutes: any;

    context('When DungeonsAndDragonsRoutesBuilder is called', () => {
        verifyIdMiddleware = () => ({});

        const mockRoute: any = (routeName: string) => ({
            routes: () =>
                [
                    {
                        method: 'get',
                        path: `/dnd5e/${routeName}`,
                        options: {
                            middlewares: [passport.authenticate('cookie', { session: false })],
                            authentication: true,
                            tag: routeName,
                        },
                    },
                    {
                        method: 'get',
                        path: `/dnd5e/${routeName}/disabled`,
                        options: {
                            middlewares: [passport.authenticate('cookie', { session: false })],
                            authentication: true,
                            tag: routeName,
                        },
                    },
                    {
                        method: 'get',
                        path: `/dnd5e/${routeName}/:id`,
                        parameters: [...generateIDParam()],
                        options: {
                            middlewares: [
                                verifyIdMiddleware,
                                passport.authenticate('cookie', { session: false }),
                            ],
                            authentication: true,
                            tag: routeName,
                        },
                    },
                    {
                        method: 'patch',
                        path: `/dnd5e/${routeName}/:id`,
                        parameters: [
                            ...generateIDParam(),
                            ...generateQueryParam(1, [
                                { name: 'availability', type: 'boolean' },
                            ]),
                        ],
                        options: {
                            middlewares: [
                                verifyIdMiddleware,
                                passport.authenticate('cookie', { session: false }),
                            ],
                            authentication: true,
                            tag: routeName,
                        },
                    },
                ] as unknown as routeInstance[],
        });

        beforeEach(() => {
            armorsRoutes = mockRoute('armors');
            backgroundsRoutes = mockRoute('backgrounds');
            classesRoutes = mockRoute('classes');
            featsRoutes = mockRoute('feats');
            godsRoutes = mockRoute('gods');
            itemsRoutes = mockRoute('items');
            racesRoutes = mockRoute('races');
            realmsRoutes = mockRoute('realms');
            magicItemsRoutes = mockRoute('magicItems');
            monstersRoutes = mockRoute('monsters');
            spellsRoutes = mockRoute('spells');
            weaponsRoutes = mockRoute('weapons');
            wikisRoutes = mockRoute('wikis');

            dungeonsAndDragonsRoutesBuilder = new DungeonsAndDragonsRoutesBuilder({
                armorsRoutes,
                backgroundsRoutes,
                classesRoutes,
                featsRoutes,
                godsRoutes,
                itemsRoutes,
                racesRoutes,
                realmsRoutes,
                magicItemsRoutes,
                monstersRoutes,
                spellsRoutes,
                weaponsRoutes,
                wikisRoutes,
            });
        });

        it('should return correct routes', () => {
            const routes = dungeonsAndDragonsRoutesBuilder.get();
            Object.values(routes.dungeonsAndDragonsRoutes).forEach((route) => {
                expect(typeof route).to.be.equal(typeof Router);
            });

            routes.dungeonsAndDragonsSwagger.forEach((route) => {
                expect(route).to.have.property('path');
                expect(route).to.have.property('method');
                expect(route).to.have.property('options');
                expect(route.options).to.have.property('middlewares');
                expect(route.options).to.have.property('authentication');
                expect(route.options).to.have.property('tag');
                expect(route.path).to.include(route.options.tag);
            });
        });
    });
});
