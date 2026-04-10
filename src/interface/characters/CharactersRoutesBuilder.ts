import { Router } from 'express';
import { buildRouter, routeInstance } from '@tablerise/auto-swagger';
import { CharactersRoutesBuilderContract } from 'src/types/modules/interface/characters/CharactersRoutesBuilder';
import bindMiddleware from 'src/domains/common/helpers/bindMiddleware';

const router = Router();

export default class CharactersRoutesBuilder {
    private readonly charactersRoutes;
    private readonly verifyUserMiddleware;

    constructor({ charactersRoutes, verifyUserMiddleware }: CharactersRoutesBuilderContract) {
        this.charactersRoutes = charactersRoutes;
        this.verifyUserMiddleware = verifyUserMiddleware;
    }

    private character(): { characterRoutes: Router; characterSwagger: routeInstance[] } {
        const characterRoutesToBuild = bindMiddleware(
            this.verifyUserMiddleware.userStatus,
            this.charactersRoutes.routes(),
            { addMethod: 'push' }
        );

        const characterRoutes = buildRouter(characterRoutesToBuild, router);
        const characterSwagger = this.charactersRoutes.routes();

        return { characterRoutes, characterSwagger };
    }

    public get(): {
        charactersSwagger: routeInstance[];
        charactersRoutes: { character: Router };
    } {
        const charactersSwagger = [...this.character().characterSwagger];
        const charactersRoutes = {
            character: this.character().characterRoutes,
        };

        return { charactersSwagger, charactersRoutes };
    }
}
