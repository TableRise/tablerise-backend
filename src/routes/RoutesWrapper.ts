import { routeOriginal } from '@tablerise/auto-swagger';
import dungeonsAndDragonsRoutes from 'src/routes/dungeons&dragons5e';
import dungeonsAndDragonsSwagger from 'src/routes/dungeons&dragons5e/swagger';
import Route from 'src/types/Route';

export default class RoutesWrapper {
    static routes(): Route {
        return {
            'dungeons&dragons5e': dungeonsAndDragonsRoutes,
        };
    }

    // prettier-ignore
    static declareRoutes(): routeOriginal {
    return [
            ...dungeonsAndDragonsSwagger
        ];
    }
}
