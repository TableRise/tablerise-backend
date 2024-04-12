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
    private readonly _imageMiddleware;

    constructor({
        campaignsController,
        verifyIdMiddleware,
        imageMiddleware,
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
                    tag: 'access',
                    description: desc.getById,
                },
            },
            {
                method: 'get',
                path: `${BASE_PATH}`,
                controller: this._campaignsController.getAll,
                options: {
                    middlewares: [passport.authenticate('cookie', { session: false })],
                    tag: 'access',
                    description: desc.getAll,
                },
            },
            // POST
            {
                method: 'post',
                path: `${BASE_PATH}/create`,
                schema: DomainDataFaker.mocks.createCampaignMock,
                controller: this._campaignsController.create,
                options: {
                    middlewares: [
                        passport.authenticate('cookie', { session: false }),
                        this._imageMiddleware.multer().single('cover'),
                        this._imageMiddleware.fileType,
                    ],
                    tag: 'management',
                    description: desc.create,
                    fileUpload: true,
                },
            },
        ] as unknown as routeInstance[];
    }
}
