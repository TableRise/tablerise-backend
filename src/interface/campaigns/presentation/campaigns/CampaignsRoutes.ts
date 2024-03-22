import 'src/interface/common/strategies/CookieStrategy';

import passport from 'passport';
import { routeInstance } from '@tablerise/auto-swagger';
import DomainDataFaker from 'src/infra/datafakers/campaigns/DomainDataFaker';
import desc from 'src/interface/campaigns/presentation/campaigns/RoutesDescription';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';
import generateIDParam, { generateFileParam, generateQueryParam } from 'src/domains/common/helpers/parametersWrapper';

const BASE_PATH = '/campaigns';

export default class CampaignsRoutes {
    private readonly _campaignsController;
    private readonly _verifyIdMiddleware;
    private readonly _imageMiddleware;

    constructor({
        campaignsController,
        verifyIdMiddleware,
        imageMiddleware
    }: InterfaceDependencies['campaignsRoutesContract']) {
        this._campaignsController = campaignsController;
        this._verifyIdMiddleware = verifyIdMiddleware;
        this._imageMiddleware = imageMiddleware;
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
                    description: desc.create,
                },
            },

            // PATCH
            {
                method: 'patch',
                path: `${BASE_PATH}/:id/update/match/map-images`,
                parameters: [
                    ...generateIDParam(),
                    ...generateFileParam(1, [{ name: 'mapImage', type: 'file', required: 'off' }]),
                    ...generateQueryParam(1, [{ name: 'operation', type: 'string' }])
                ],
                controller: this._campaignsController.updateMatchImages,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._imageMiddleware.multer().single('image'),
                        this._imageMiddleware.fileType
                    ],
                    description: desc.updateMatchImages
                }
            }
        ] as routeInstance[];
    }
}
