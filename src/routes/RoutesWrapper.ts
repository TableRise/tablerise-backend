import dungeonsAndDragonsRoutes from 'src/routes/dungeons&dragons5e';
import dungeonsAndDragonsSwagger from 'src/routes/dungeons&dragons5e/swagger';
import userRoutes from 'src/routes/user';
import userSwagger from 'src/routes/user/swagger';
import Route, { RouteDeclarations } from 'src/types/Route';

export default class RoutesWrapper {
    static routes(): Route {
        return {
            'dungeons&dragons5e': dungeonsAndDragonsRoutes,
            user: userRoutes,
        };
    }

    // prettier-ignore
    static declareRoutes(): RouteDeclarations {
    return {
            'dungeons&dragons5e': [...dungeonsAndDragonsSwagger ],
            user: [ ...userSwagger ]
        };
    }
}
