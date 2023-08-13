import dungeonsAndDragonsRoutes from 'src/routes/dungeons&dragons5e';
import dungeonsAndDragonsSwagger from 'src/routes/dungeons&dragons5e/swagger';
import Route, { RouteWrapperDeclared } from 'src/types/Route';

export default class RoutesWrapper {
    static routes(): Route {
        return {
            "dungeons&dragons5e": dungeonsAndDragonsRoutes
        };
    }

    // prettier-ignore
    static declareRoutes(): RouteWrapperDeclared[][] {
    return [
            ...dungeonsAndDragonsSwagger
        ];
    }
}