import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

const BASE_PATH = '/campaigns';

export default class CampaignsRoutes {
    private readonly _campaignsController;

    constructor({ campaignsController }: InterfaceDependencies['usersRoutesContract']) {
        this._campaignsController = campaignsController;
    }

    public routes(): routeInstance[] {
        return [
            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/create`,
                controller: this._campaignsController.create,
                schema: DomainDataFaker.mocks.createCampaignMock,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'create',
                    description: desc.create,
                },
            },
        ] as unknown as routeInstance[];
    }
}
