import dungeonsAndDragonsRoutes, { dungeonsAndDragonsSwagger } from 'src/routes/dungeons&dragons5e';
import Route, { RouteDeclarations } from 'src/types/requests/Route';
import { RoutesWrapperContract } from 'src/types/contracts/users/presentation/RoutesWrapper';

export default class RoutesWrapper extends RoutesWrapperContract {
    constructor({ userRoutesBuilder }: RoutesWrapperContract) {
        super();
        this.userRoutesBuilder = userRoutesBuilder;
    }

    public routes(): Route {
        return {
            'dungeons&dragons5e': dungeonsAndDragonsRoutes,
            user: this.userRoutesBuilder.get().usersRoutes,
        };
    }

    // prettier-ignore
    public declareRoutes(): RouteDeclarations {
    return {
            'dungeons&dragons5e': [...dungeonsAndDragonsSwagger ],
            user: [ ...this.userRoutesBuilder.get().usersSwagger ]
        };
    }
}
