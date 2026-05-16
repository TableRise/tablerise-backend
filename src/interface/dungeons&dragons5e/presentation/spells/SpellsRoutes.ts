import 'src/interface/common/strategies/CookieStrategy';
import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import generateIDParam, { generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';
import { SpellsRoutesContract } from 'src/types/modules/interface/dungeons&dragons5e/presentation/spells/SpellsRoutes';

const BASE_PATH = '/system/dnd5e/spells';
const desc = {
    getAll: 'List all D&D 5e spells available in the system.',
    getDisabled: 'List D&D 5e spells currently marked as unavailable.',
    getByLevel: 'List D&D 5e spells filtered by spell level.',
    getById: 'Get one D&D 5e spell by id.',
    toggleAvailability: 'Enable or disable a D&D 5e spell.',
};

export default class SpellsRoutes {
    private readonly spellsController;
    private readonly verifyIdMiddleware;

    constructor({ spellsController, verifyIdMiddleware }: SpellsRoutesContract) {
        this.spellsController = spellsController;
        this.verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this.spellsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'spells',
                    description: desc.getAll,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/disabled`,
                controller: this.spellsController.getDisabled,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'spells',
                    description: desc.getDisabled,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/by-level`,
                parameters: [...generateQueryParam(1, [{ name: 'queryLevel', type: 'string' }])],
                controller: this.spellsController.getByLevel,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'spells',
                    description: desc.getByLevel,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this.spellsController.get,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'spells',
                    description: desc.getById,
                },
            },
            {
                method: 'patch',
                path: `${BASE_PATH}/:id`,
                parameters: [
                    ...generateIDParam(),
                    ...generateQueryParam(1, [{ name: 'availability', type: 'boolean' }]),
                ],
                controller: this.spellsController.toggleAvailability,
                options: {
                    middlewares: [this.verifyIdMiddleware, passport.authenticate('cookie', { session: false })],
                    tag: 'spells',
                    description: desc.toggleAvailability,
                },
            },
        ] as unknown as routeInstance[];
    }
}
