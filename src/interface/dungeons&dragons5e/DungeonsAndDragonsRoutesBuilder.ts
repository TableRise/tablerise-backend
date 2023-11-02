import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { DungeonsAndDragonsRoutesBuilderContract } from 'src/types/dungeons&dragons5e/contracts/presentation/BuildRoutes';

const router = Router();

export default class DungeonsAndDragonsRoutesBuilder {
    private readonly _armorsRoutes;

    constructor({ armorsRoutes }: DungeonsAndDragonsRoutesBuilderContract) {
        this._armorsRoutes = armorsRoutes;
    }

    private _armors(): { armorsRoutes: Router; armorsSwagger: routeInstance[] } {
        const armorsRoutes = buildRouter(this._armorsRoutes.routes(), router);
        const armorsSwagger = this._armorsRoutes.routes();

        return { armorsRoutes, armorsSwagger };
    }

    public get(): { dungeonsAndDragonsSwagger: routeInstance[]; dungeonsAndDragonsRoutes: {
        armors: Router,
    } } {
        const dungeonsAndDragonsSwagger = [
            ...this._armors().armorsSwagger,
        ];

        const dungeonsAndDragonsRoutes = {
            armors: this._armors().armorsRoutes,
        };

        return { dungeonsAndDragonsSwagger, dungeonsAndDragonsRoutes };
    }
}
