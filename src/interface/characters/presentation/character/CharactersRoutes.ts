import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import DomainDataFaker from 'src/infra/datafakers/characters/DomainDataFaker';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import desc from 'src/interface/characters/presentation/character/RoutesDescription';

const BASE_PATH = '/characters';

export default class CharactersRoutes {
    private readonly _charactersController;
    private readonly _verifyIdMiddleware;
    private readonly _imageMiddleware;

    constructor({
        charactersController,
        verifyIdMiddleware,
        imageMiddleware,
    }: InterfaceDependencies['charactersRoutesContract']) {
        this._charactersController = charactersController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._imageMiddleware = imageMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            // GET
            {
                method: 'get',
                path: `${BASE_PATH}/by-campaign/:id`,
                controller: this._charactersController.recoverCharactersByCampaign,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._verifyIdMiddleware,
                    ],
                    description: desc.getByCampaign,
                    tag: 'recover',
                },
            },

            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/create`,
                schema: DomainDataFaker.mocks.createCharacterMock,
                controller: this._charactersController.createCharacter,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    description: desc.create,
                    tag: 'create',
                },
            },

            // PUT

            // PATCH
        ] as routeInstance[];
    }
}
