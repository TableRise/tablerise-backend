// import dungeonsAndDragonsRoutes, { dungeonsAndDragonsSwagger } from 'src/routes/dungeons&dragons5e';
import Route, { RouteDeclarations } from 'src/types/users/requests/Route';
import { RoutesWrapperContract } from 'src/types/users/contracts/presentation/RoutesWrapper';

export default class RoutesWrapper {
    private readonly _usersRoutesBuilder;

    constructor({ usersRoutesBuilder }: RoutesWrapperContract) {
        this._usersRoutesBuilder = usersRoutesBuilder;
    }

    public routes(): Route {
        return {
            // 'dungeons&dragons5e': dungeonsAndDragonsRoutes,
            user: this._usersRoutesBuilder.get().usersRoutes,
        };
    }

    // prettier-ignore
    public declareRoutes(): RouteDeclarations {
    return {
            // 'dungeons&dragons5e': [...dungeonsAndDragonsSwagger ],
            user: [ ...this._usersRoutesBuilder.get().usersSwagger ]
        };
    }
}
