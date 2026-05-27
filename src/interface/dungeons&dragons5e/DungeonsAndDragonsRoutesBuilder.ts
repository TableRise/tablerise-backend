import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { DungeonsAndDragonsRoutesBuilderContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/DungeonsAndDragonsRoutesBuildes';

const router = Router();

export default class DungeonsAndDragonsRoutesBuilder {
    private readonly backgroundsRoutes;
    private readonly classesRoutes;
    private readonly equipmentRoutes;
    private readonly featsRoutes;
    private readonly racesRoutes;
    private readonly spellsRoutes;

    constructor({
        backgroundsRoutes,
        classesRoutes,
        equipmentRoutes,
        featsRoutes,
        racesRoutes,
        spellsRoutes,
    }: DungeonsAndDragonsRoutesBuilderContract) {
        this.backgroundsRoutes = backgroundsRoutes;
        this.classesRoutes = classesRoutes;
        this.equipmentRoutes = equipmentRoutes;
        this.featsRoutes = featsRoutes;
        this.racesRoutes = racesRoutes;
        this.spellsRoutes = spellsRoutes;
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

    private equipment(): { equipmentRoutes: Router; equipmentSwagger: routeInstance[] } {
        const equipmentRoutes = buildRouter(this.equipmentRoutes.routes(), router);
        const equipmentSwagger = this.equipmentRoutes.routes();

        return { equipmentRoutes, equipmentSwagger };
    }

    private feats(): { featsRoutes: Router; featsSwagger: routeInstance[] } {
        const featsRoutes = buildRouter(this.featsRoutes.routes(), router);
        const featsSwagger = this.featsRoutes.routes();

        return { featsRoutes, featsSwagger };
    }

    private races(): { racesRoutes: Router; racesSwagger: routeInstance[] } {
        const racesRoutes = buildRouter(this.racesRoutes.routes(), router);
        const racesSwagger = this.racesRoutes.routes();

        return { racesRoutes, racesSwagger };
    }

    private spells(): { spellsRoutes: Router; spellsSwagger: routeInstance[] } {
        const spellsRoutes = buildRouter(this.spellsRoutes.routes(), router);
        const spellsSwagger = this.spellsRoutes.routes();

        return { spellsRoutes, spellsSwagger };
    }

    public get(): {
        dungeonsAndDragonsSwagger: routeInstance[];
        dungeonsAndDragonsRoutes: {
            backgrounds: Router;
            classes: Router;
            feats: Router;
            races: Router;
            equipment: Router;
            spells: Router;
        };
    } {
        const dungeonsAndDragonsSwagger = [
            ...this.backgrounds().backgroundsSwagger,
            ...this.classes().classesSwagger,
            ...this.equipment().equipmentSwagger,
            ...this.feats().featsSwagger,
            ...this.races().racesSwagger,
            ...this.spells().spellsSwagger,
        ];

        const dungeonsAndDragonsRoutes = {
            backgrounds: this.backgrounds().backgroundsRoutes,
            classes: this.classes().classesRoutes,
            equipment: this.equipment().equipmentRoutes,
            feats: this.feats().featsRoutes,
            races: this.races().racesRoutes,
            spells: this.spells().spellsRoutes,
        };

        return { dungeonsAndDragonsSwagger, dungeonsAndDragonsRoutes };
    }
}
