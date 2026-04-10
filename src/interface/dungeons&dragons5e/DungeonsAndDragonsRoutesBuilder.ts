import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { DungeonsAndDragonsRoutesBuilderContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/DungeonsAndDragonsRoutesBuildes';

const router = Router();

export default class DungeonsAndDragonsRoutesBuilder {
    private readonly armorsRoutes;
    private readonly backgroundsRoutes;
    private readonly classesRoutes;
    private readonly featsRoutes;
    private readonly godsRoutes;
    private readonly itemsRoutes;
    private readonly racesRoutes;
    private readonly realmsRoutes;
    private readonly magicItemsRoutes;
    private readonly monstersRoutes;
    private readonly spellsRoutes;
    private readonly weaponsRoutes;
    private readonly wikisRoutes;

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
        this.armorsRoutes = armorsRoutes;
        this.backgroundsRoutes = backgroundsRoutes;
        this.classesRoutes = classesRoutes;
        this.featsRoutes = featsRoutes;
        this.godsRoutes = godsRoutes;
        this.itemsRoutes = itemsRoutes;
        this.racesRoutes = racesRoutes;
        this.realmsRoutes = realmsRoutes;
        this.magicItemsRoutes = magicItemsRoutes;
        this.monstersRoutes = monstersRoutes;
        this.spellsRoutes = spellsRoutes;
        this.weaponsRoutes = weaponsRoutes;
        this.wikisRoutes = wikisRoutes;
    }

    private armors(): { armorsRoutes: Router; armorsSwagger: routeInstance[] } {
        const armorsRoutes = buildRouter(this.armorsRoutes.routes(), router);
        const armorsSwagger = this.armorsRoutes.routes();

        return { armorsRoutes, armorsSwagger };
    }

    private backgrounds(): {
        backgroundsRoutes: Router;
        backgroundsSwagger: routeInstance[];
    } {
        const backgroundsRoutes = buildRouter(this.backgroundsRoutes.routes(), router);
        const backgroundsSwagger = this.backgroundsRoutes.routes();

        return { backgroundsRoutes, backgroundsSwagger };
    }

    private classes(): { classesRoutes: Router; classesSwagger: routeInstance[] } {
        const classesRoutes = buildRouter(this.classesRoutes.routes(), router);
        const classesSwagger = this.classesRoutes.routes();

        return { classesRoutes, classesSwagger };
    }

    private feats(): { featsRoutes: Router; featsSwagger: routeInstance[] } {
        const featsRoutes = buildRouter(this.featsRoutes.routes(), router);
        const featsSwagger = this.featsRoutes.routes();

        return { featsRoutes, featsSwagger };
    }

    private gods(): { godsRoutes: Router; godsSwagger: routeInstance[] } {
        const godsRoutes = buildRouter(this.godsRoutes.routes(), router);
        const godsSwagger = this.godsRoutes.routes();

        return { godsRoutes, godsSwagger };
    }

    private items(): { itemsRoutes: Router; itemsSwagger: routeInstance[] } {
        const itemsRoutes = buildRouter(this.itemsRoutes.routes(), router);
        const itemsSwagger = this.itemsRoutes.routes();

        return { itemsRoutes, itemsSwagger };
    }

    private races(): { racesRoutes: Router; racesSwagger: routeInstance[] } {
        const racesRoutes = buildRouter(this.racesRoutes.routes(), router);
        const racesSwagger = this.racesRoutes.routes();

        return { racesRoutes, racesSwagger };
    }

    private realms(): { realmsRoutes: Router; realmsSwagger: routeInstance[] } {
        const realmsRoutes = buildRouter(this.realmsRoutes.routes(), router);
        const realmsSwagger = this.realmsRoutes.routes();

        return { realmsRoutes, realmsSwagger };
    }

    private magicItems(): {
        magicItemsRoutes: Router;
        magicItemsSwagger: routeInstance[];
    } {
        const magicItemsRoutes = buildRouter(this.magicItemsRoutes.routes(), router);
        const magicItemsSwagger = this.magicItemsRoutes.routes();

        return { magicItemsRoutes, magicItemsSwagger };
    }

    private monsters(): { monstersRoutes: Router; monstersSwagger: routeInstance[] } {
        const monstersRoutes = buildRouter(this.monstersRoutes.routes(), router);
        const monstersSwagger = this.monstersRoutes.routes();

        return { monstersRoutes, monstersSwagger };
    }

    private spells(): { spellsRoutes: Router; spellsSwagger: routeInstance[] } {
        const spellsRoutes = buildRouter(this.spellsRoutes.routes(), router);
        const spellsSwagger = this.spellsRoutes.routes();

        return { spellsRoutes, spellsSwagger };
    }

    private weapons(): { weaponsRoutes: Router; weaponsSwagger: routeInstance[] } {
        const weaponsRoutes = buildRouter(this.weaponsRoutes.routes(), router);
        const weaponsSwagger = this.weaponsRoutes.routes();

        return { weaponsRoutes, weaponsSwagger };
    }

    private wikis(): { wikisRoutes: Router; wikisSwagger: routeInstance[] } {
        const wikisRoutes = buildRouter(this.wikisRoutes.routes(), router);
        const wikisSwagger = this.wikisRoutes.routes();

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
