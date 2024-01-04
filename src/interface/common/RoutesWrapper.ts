// import dungeonsAndDragonsRoutes, { dungeonsAndDragonsSwagger } from 'src/routes/dungeons&dragons5e';
import Route, { RouteDeclarations } from 'src/types/modules/interface/common/Routes';
import InterfaceDependencies from 'src/types/modules/interface/InterfaceDependencies';

export default class RoutesWrapper {
    private readonly _dungeonsAndDragonsRoutesBuilder;
    private readonly _usersRoutesBuilder;

    constructor({
        dungeonsAndDragonsRoutesBuilder,
        usersRoutesBuilder,
    }: InterfaceDependencies['routesWrapperContract']) {
        this._dungeonsAndDragonsRoutesBuilder = dungeonsAndDragonsRoutesBuilder;
        this._usersRoutesBuilder = usersRoutesBuilder;
    }

    public routes(): Route {
        return {
            'dungeons&dragons5e':
                this._dungeonsAndDragonsRoutesBuilder.get().dungeonsAndDragonsRoutes,
            user: this._usersRoutesBuilder.get().usersRoutes,
        };
    }

    // prettier-ignore
    public declareRoutes(): RouteDeclarations {
    return {
            'dungeons&dragons5e': [...this._dungeonsAndDragonsRoutesBuilder.get().dungeonsAndDragonsSwagger ],
            user: [ ...this._usersRoutesBuilder.get().usersSwagger ]
        };
    }
}
