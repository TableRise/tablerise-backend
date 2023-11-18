import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { DungeonsAndDragonsRoutesBuilderContract } from 'src/types/dungeons&dragons5e/contracts/presentation/BuildRoutes';

const router = Router();

export default class DungeonsAndDragonsRoutesBuilder {
    private readonly _armorsRoutes;
    private readonly _backgroundsRoutes;
    private readonly _classesRoutes;
    private readonly _featsRoutes;
    private readonly _godsRoutes;
    private readonly _itemsRoutes;
    private readonly _racesRoutes;
    private readonly _realmsRoutes;
    private readonly _magicItemsRoutes;
    private readonly _monstersRoutes;
    private readonly _spellsRoutes;

    constructor({
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
    }: DungeonsAndDragonsRoutesBuilderContract) {
        this._armorsRoutes = armorsRoutes;
        this._backgroundsRoutes = backgroundsRoutes;
        this._classesRoutes = classesRoutes;
        this._featsRoutes = featsRoutes;
        this._godsRoutes = godsRoutes;
        this._itemsRoutes = itemsRoutes;
        this._racesRoutes = racesRoutes;
        this._realmsRoutes = realmsRoutes;
        this._magicItemsRoutes = magicItemsRoutes;
        this._monstersRoutes = monstersRoutes;
        this._spellsRoutes = spellsRoutes;
    }

    private _armors(): { armorsRoutes: Router; armorsSwagger: routeInstance[] } {
        const armorsRoutes = buildRouter(this._armorsRoutes.routes(), router);
        const armorsSwagger = this._armorsRoutes.routes();

        return { armorsRoutes, armorsSwagger };
    }

    private _backgrounds(): {
        backgroundsRoutes: Router;
        backgroundsSwagger: routeInstance[];
    } {
        const backgroundsRoutes = buildRouter(this._backgroundsRoutes.routes(), router);
        const backgroundsSwagger = this._backgroundsRoutes.routes();

        return { backgroundsRoutes, backgroundsSwagger };
    }

    private _classes(): { classesRoutes: Router; classesSwagger: routeInstance[] } {
        const classesRoutes = buildRouter(this._classesRoutes.routes(), router);
        const classesSwagger = this._classesRoutes.routes();

        return { classesRoutes, classesSwagger };
    }

    private _feats(): { featsRoutes: Router; featsSwagger: routeInstance[] } {
        const featsRoutes = buildRouter(this._featsRoutes.routes(), router);
        const featsSwagger = this._featsRoutes.routes();

        return { featsRoutes, featsSwagger };
    }

    private _gods(): { godsRoutes: Router; godsSwagger: routeInstance[] } {
        const godsRoutes = buildRouter(this._godsRoutes.routes(), router);
        const godsSwagger = this._godsRoutes.routes();

        return { godsRoutes, godsSwagger };
    }

    private _items(): { itemsRoutes: Router; itemsSwagger: routeInstance[] } {
        const itemsRoutes = buildRouter(this._itemsRoutes.routes(), router);
        const itemsSwagger = this._itemsRoutes.routes();

        return { itemsRoutes, itemsSwagger };
    }

    private _races(): { racesRoutes: Router; racesSwagger: routeInstance[] } {
        const racesRoutes = buildRouter(this._racesRoutes.routes(), router);
        const racesSwagger = this._racesRoutes.routes();

        return { racesRoutes, racesSwagger };
    }

    private _realms(): { realmsRoutes: Router; realmsSwagger: routeInstance[] } {
        const realmsRoutes = buildRouter(this._realmsRoutes.routes(), router);
        const realmsSwagger = this._realmsRoutes.routes();

        return { realmsRoutes, realmsSwagger };
    }

    private _magicItems(): {
        magicItemsRoutes: Router;
        magicItemsSwagger: routeInstance[];
    } {
        const magicItemsRoutes = buildRouter(this._magicItemsRoutes.routes(), router);
        const magicItemsSwagger = this._magicItemsRoutes.routes();

        return { magicItemsRoutes, magicItemsSwagger };
    }

    private _monsters(): { monstersRoutes: Router; monstersSwagger: routeInstance[] } {
        const monstersRoutes = buildRouter(this._monstersRoutes.routes(), router);
        const monstersSwagger = this._monstersRoutes.routes();

        return { monstersRoutes, monstersSwagger };
    }

    private _spells(): { spellsRoutes: Router; spellsSwagger: routeInstance[] } {
        const spellsRoutes = buildRouter(this._spellsRoutes.routes(), router);
        const spellsSwagger = this._spellsRoutes.routes();

        return { spellsRoutes, spellsSwagger };
    }

    public get(): {
        dungeonsAndDragonsSwagger: routeInstance[];
        dungeonsAndDragonsRoutes: {
            armors: Router;
            backgrounds: Router;
            classes: Router;
            feats: Router;
            gods: Router;
            items: Router;
            races: Router;
            realms: Router;
            magicItems: Router;
            monsters: Router;
            spells: Router;
        };
    } {
        const dungeonsAndDragonsSwagger = [
            ...this._armors().armorsSwagger,
            ...this._backgrounds().backgroundsSwagger,
            ...this._classes().classesSwagger,
            ...this._feats().featsSwagger,
            ...this._gods().godsSwagger,
            ...this._items().itemsSwagger,
            ...this._races().racesSwagger,
            ...this._realms().realmsSwagger,
            ...this._magicItems().magicItemsSwagger,
            ...this._monsters().monstersSwagger,
            ...this._spells().spellsSwagger,
        ];

        const dungeonsAndDragonsRoutes = {
            armors: this._armors().armorsRoutes,
            backgrounds: this._backgrounds().backgroundsRoutes,
            classes: this._classes().classesRoutes,
            feats: this._feats().featsRoutes,
            gods: this._gods().godsRoutes,
            items: this._items().itemsRoutes,
            races: this._races().racesRoutes,
            realms: this._realms().realmsRoutes,
            magicItems: this._magicItems().magicItemsRoutes,
            monsters: this._monsters().monstersRoutes,
            spells: this._spells().spellsRoutes,
        };

        return { dungeonsAndDragonsSwagger, dungeonsAndDragonsRoutes };
    }
}
