import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { CharactersRoutesBuilderContract } from 'src/types/modules/interface/characters/CharactersRoutesBuilder';
// import bindMiddleware from 'src/domains/common/helpers/bindMiddleware';

const router = Router();

export default class CharactersRoutesBuilder {
    private readonly _charactersRoutes;
    private readonly _verifyUserMiddleware;

    constructor({
        charactersRoutes,
        verifyUserMiddleware,
    }: CharactersRoutesBuilderContract) {
        this._charactersRoutes = charactersRoutes;
        this._verifyUserMiddleware = verifyUserMiddleware;
    }

    private _character(): { characterRoutes: Router; characterSwagger: routeInstance[] } {
        // const characterRoutesToBuild = bindMiddleware(
        //     this._verifyUserMiddleware.userStatus,
        //     this._charactersRoutes.routes(),
        //     { addMethod: 'push' }
        // );

        const characterRoutes = buildRouter(this._charactersRoutes.routes(), router);
        const characterSwagger = this._charactersRoutes.routes();

        return { characterRoutes, characterSwagger };
    }

    public get(): {
        charactersSwagger: routeInstance[];
        charactersRoutes: { character: Router };
    } {
        const charactersSwagger = [...this._character().characterSwagger];
        const charactersRoutes = {
            character: this._character().characterRoutes,
        };

        return { charactersSwagger, charactersRoutes };
    }
}
