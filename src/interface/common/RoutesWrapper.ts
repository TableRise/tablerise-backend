// import dungeonsAndDragonsRoutes, { dungeonsAndDragonsSwagger } from 'src/routes/dungeons&dragons5e';
import Route, { RouteDeclarations } from 'src/types/users/requests/Route';
import { RoutesWrapperContract } from 'src/types/users/contracts/presentation/RoutesWrapper';

export default class RoutesWrapper {
    private readonly _dungeonsAndDragonsRoutesBuilder;
    private readonly _usersRoutesBuilder;

    constructor({ dungeonsAndDragonsRoutesBuilder, usersRoutesBuilder }: RoutesWrapperContract) {
        this._dungeonsAndDragonsRoutesBuilder = dungeonsAndDragonsRoutesBuilder;
        this._usersRoutesBuilder = usersRoutesBuilder;
    }

    public routes(): Route {
        return {
            'dungeons&dragons5e': this._dungeonsAndDragonsRoutesBuilder.get().dungeonsAndDragonsRoutes,
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
