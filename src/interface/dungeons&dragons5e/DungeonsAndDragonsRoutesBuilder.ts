import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { DungeonsAndDragonsRoutesBuilderContract } from 'src/types/dungeons&dragons5e/contracts/presentation/BuildRoutes';

const router = Router();

export default class DungeonsAndDragonsRoutesBuilder {
    private readonly _armorsRoutes;
    private readonly _backgroundsRoutes;

    constructor({ armorsRoutes, backgroundsRoutes }: DungeonsAndDragonsRoutesBuilderContract) {
        this._armorsRoutes = armorsRoutes;
        this._backgroundsRoutes = backgroundsRoutes;
    }

    private _armors(): { armorsRoutes: Router; armorsSwagger: routeInstance[] } {
        const armorsRoutes = buildRouter(this._armorsRoutes.routes(), router);
        const armorsSwagger = this._armorsRoutes.routes();

        return { armorsRoutes, armorsSwagger };
    }

    private _backgrounds(): { backgroundsRoutes: Router; backgroundsSwagger: routeInstance[] } {
        const backgroundsRoutes = buildRouter(this._backgroundsRoutes.routes(), router);
        const backgroundsSwagger = this._backgroundsRoutes.routes();

        return { backgroundsRoutes, backgroundsSwagger };
    }

    public get(): {
        dungeonsAndDragonsSwagger: routeInstance[];
        dungeonsAndDragonsRoutes: {
            armors: Router;
            backgrounds: Router;
        };
    } {
        const dungeonsAndDragonsSwagger = [
            ...this._armors().armorsSwagger,
            ...this._backgrounds().backgroundsSwagger
        ];

        const dungeonsAndDragonsRoutes = {
            armors: this._armors().armorsRoutes,
            backgrounds: this._backgrounds().backgroundsRoutes
        };

        return { dungeonsAndDragonsSwagger, dungeonsAndDragonsRoutes };
    }
}
