import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import generateIDParam from 'src/domains/common/helpers/parametersWrapper';

const BASE_PATH = '/campaigns';

export default class CampaignsRoutes {
    private readonly _campaignsController;
    private readonly _verifyIdMiddleware;

    constructor({
        campaignsController,
        verifyIdMiddleware,
    }: InterfaceDependencies['campaignsRoutesContract']) {
        this._campaignsController = campaignsController;
        this._verifyIdMiddleware = verifyIdMiddleware;
    }

    public routes(): routeInstance[] {
        return [
            // GET
            {
                method: 'get',
                path: `${BASE_PATH}/:id`,
                parameters: [...generateIDParam()],
                controller: this._campaignsController.getById,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._verifyIdMiddleware,
                    ],
                    tag: 'access',
                    description: desc.getById,
                },
            },
            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/create`,
                controller: this._campaignsController.create,
                schema: DomainDataFaker.mocks.createCampaignMock,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'management',
                    description: desc.create,
                },
            },
        ] as unknown as routeInstance[];
    }
}
