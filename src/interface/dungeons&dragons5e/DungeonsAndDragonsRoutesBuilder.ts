import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { DungeonsAndDragonsRoutesBuilderContract } from 'src/types/dungeons&dragons5e/contracts/presentation/BuildRoutes';

const router = Router();

export default class DungeonsAndDragonsRoutesBuilder {
    private readonly _armorsRoutes;
    private readonly _backgroundsRoutes;
    private readonly _classesRoutes;
    private readonly _featsRoutes;

    constructor({
        armorsRoutes,
        backgroundsRoutes,
        classesRoutes,
        featsRoutes,
    }: DungeonsAndDragonsRoutesBuilderContract) {
        this._armorsRoutes = armorsRoutes;
        this._backgroundsRoutes = backgroundsRoutes;
        this._classesRoutes = classesRoutes;
        this._featsRoutes = featsRoutes;
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

    public get(): {
        dungeonsAndDragonsSwagger: routeInstance[];
        dungeonsAndDragonsRoutes: {
            armors: Router;
            backgrounds: Router;
            classes: Router;
            feats: Router;
        };
    } {
        const dungeonsAndDragonsSwagger = [
            ...this._armors().armorsSwagger,
            ...this._backgrounds().backgroundsSwagger,
            ...this._classes().classesSwagger,
            ...this._feats().featsSwagger,
        ];

        const dungeonsAndDragonsRoutes = {
            armors: this._armors().armorsRoutes,
            backgrounds: this._backgrounds().backgroundsRoutes,
            classes: this._classes().classesRoutes,
            feats: this._feats().featsRoutes,
        };

        return { dungeonsAndDragonsSwagger, dungeonsAndDragonsRoutes };
    }
}
