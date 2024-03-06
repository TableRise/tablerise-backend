// import dungeonsAndDragonsRoutes, { dungeonsAndDragonsSwagger } from 'src/routes/dungeons&dragons5e';
import Route, { RouteDeclarations } from 'src/types/modules/interface/common/Routes';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class RoutesWrapper {
    private readonly _dungeonsAndDragonsRoutesBuilder;
    private readonly _usersRoutesBuilder;
    private readonly _campaignsRoutesBuilder;

    constructor({
        dungeonsAndDragonsRoutesBuilder,
        usersRoutesBuilder,
        campaignsRoutesBuilder,
    }: InterfaceDependencies['routesWrapperContract']) {
        this._dungeonsAndDragonsRoutesBuilder = dungeonsAndDragonsRoutesBuilder;
        this._usersRoutesBuilder = usersRoutesBuilder;
        this._campaignsRoutesBuilder = campaignsRoutesBuilder;
    }

    public routes(): Route {
        return {
            'dungeons&dragons5e':
                this._dungeonsAndDragonsRoutesBuilder.get().dungeonsAndDragonsRoutes,
            user: this._usersRoutesBuilder.get().usersRoutes,
            campaign: this._campaignsRoutesBuilder.get().campaignsRoutes,
        };
    }

    // prettier-ignore
    public declareRoutes(): RouteDeclarations {
    return {
            'dungeons&dragons5e': [...this._dungeonsAndDragonsRoutesBuilder.get().dungeonsAndDragonsSwagger ],
            user: [ ...this._usersRoutesBuilder.get().usersSwagger ],
            campaign: [ ...this._campaignsRoutesBuilder.get().campaignsSwagger ],
        };
    }
}
