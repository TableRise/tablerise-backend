import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { DungeonsAndDragonsRoutesBuilderContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/DungeonsAndDragonsRoutesBuildes';

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
    private readonly _weaponsRoutes;
    private readonly _wikisRoutes;

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
        weaponsRoutes,
        wikisRoutes,
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
        this._weaponsRoutes = weaponsRoutes;
        this._wikisRoutes = wikisRoutes;
    }

    private armors(): { armorsRoutes: Router; armorsSwagger: routeInstance[] } {
        const armorsRoutes = buildRouter(this._armorsRoutes.routes(), router);
        const armorsSwagger = this._armorsRoutes.routes();

        return { armorsRoutes, armorsSwagger };
    }

    private backgrounds(): {
        backgroundsRoutes: Router;
        backgroundsSwagger: routeInstance[];
    } {
        const backgroundsRoutes = buildRouter(this._backgroundsRoutes.routes(), router);
        const backgroundsSwagger = this._backgroundsRoutes.routes();

        return { backgroundsRoutes, backgroundsSwagger };
    }

    private classes(): { classesRoutes: Router; classesSwagger: routeInstance[] } {
        const classesRoutes = buildRouter(this._classesRoutes.routes(), router);
        const classesSwagger = this._classesRoutes.routes();

        return { classesRoutes, classesSwagger };
    }

    private feats(): { featsRoutes: Router; featsSwagger: routeInstance[] } {
        const featsRoutes = buildRouter(this._featsRoutes.routes(), router);
        const featsSwagger = this._featsRoutes.routes();

        return { featsRoutes, featsSwagger };
    }

    private gods(): { godsRoutes: Router; godsSwagger: routeInstance[] } {
        const godsRoutes = buildRouter(this._godsRoutes.routes(), router);
        const godsSwagger = this._godsRoutes.routes();

        return { godsRoutes, godsSwagger };
    }

    private items(): { itemsRoutes: Router; itemsSwagger: routeInstance[] } {
        const itemsRoutes = buildRouter(this._itemsRoutes.routes(), router);
        const itemsSwagger = this._itemsRoutes.routes();

        return { itemsRoutes, itemsSwagger };
    }

    private races(): { racesRoutes: Router; racesSwagger: routeInstance[] } {
        const racesRoutes = buildRouter(this._racesRoutes.routes(), router);
        const racesSwagger = this._racesRoutes.routes();

        return { racesRoutes, racesSwagger };
    }

    private realms(): { realmsRoutes: Router; realmsSwagger: routeInstance[] } {
        const realmsRoutes = buildRouter(this._realmsRoutes.routes(), router);
        const realmsSwagger = this._realmsRoutes.routes();

        return { realmsRoutes, realmsSwagger };
    }

    private magicItems(): {
        magicItemsRoutes: Router;
        magicItemsSwagger: routeInstance[];
    } {
        const magicItemsRoutes = buildRouter(this._magicItemsRoutes.routes(), router);
        const magicItemsSwagger = this._magicItemsRoutes.routes();

        return { magicItemsRoutes, magicItemsSwagger };
    }

    private monsters(): { monstersRoutes: Router; monstersSwagger: routeInstance[] } {
        const monstersRoutes = buildRouter(this._monstersRoutes.routes(), router);
        const monstersSwagger = this._monstersRoutes.routes();

        return { monstersRoutes, monstersSwagger };
    }

    private spells(): { spellsRoutes: Router; spellsSwagger: routeInstance[] } {
        const spellsRoutes = buildRouter(this._spellsRoutes.routes(), router);
        const spellsSwagger = this._spellsRoutes.routes();

        return { spellsRoutes, spellsSwagger };
    }

    private weapons(): { weaponsRoutes: Router; weaponsSwagger: routeInstance[] } {
        const weaponsRoutes = buildRouter(this._weaponsRoutes.routes(), router);
        const weaponsSwagger = this._weaponsRoutes.routes();

        return { weaponsRoutes, weaponsSwagger };
    }

    private wikis(): { wikisRoutes: Router; wikisSwagger: routeInstance[] } {
        const wikisRoutes = buildRouter(this._wikisRoutes.routes(), router);
        const wikisSwagger = this._wikisRoutes.routes();

        return { wikisRoutes, wikisSwagger };
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
            weapons: Router;
            wikis: Router;
        };
    } {
        const dungeonsAndDragonsSwagger = [
            ...this.armors().armorsSwagger,
            ...this.backgrounds().backgroundsSwagger,
            ...this.classes().classesSwagger,
            ...this.feats().featsSwagger,
            ...this.gods().godsSwagger,
            ...this.items().itemsSwagger,
            ...this.races().racesSwagger,
            ...this.realms().realmsSwagger,
            ...this.magicItems().magicItemsSwagger,
            ...this.monsters().monstersSwagger,
            ...this.spells().spellsSwagger,
            ...this.weapons().weaponsSwagger,
            ...this.wikis().wikisSwagger,
        ];

        const dungeonsAndDragonsRoutes = {
            armors: this.armors().armorsRoutes,
            backgrounds: this.backgrounds().backgroundsRoutes,
            classes: this.classes().classesRoutes,
            feats: this.feats().featsRoutes,
            gods: this.gods().godsRoutes,
            items: this.items().itemsRoutes,
            races: this.races().racesRoutes,
            realms: this.realms().realmsRoutes,
            magicItems: this.magicItems().magicItemsRoutes,
            monsters: this.monsters().monstersRoutes,
            spells: this.spells().spellsRoutes,
            weapons: this.weapons().weaponsRoutes,
            wikis: this.wikis().wikisRoutes,
        };

        return { dungeonsAndDragonsSwagger, dungeonsAndDragonsRoutes };
    }
}
