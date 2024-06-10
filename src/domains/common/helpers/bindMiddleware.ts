import { routeInstance } from '@tablerise/auto-swagger';
import express from 'express';
import { bindOptions } from 'src/types/modules/domains/common/helpers/bindMiddleware';

export default function bindMiddleware(
    middleware: express.Handler,
    routes: routeInstance[],
    options: bindOptions = {
        substringLoc: 0,
        pathsToIgnore: [],
        addMethod: 'push',
    }
): routeInstance[] {
    const routesToBind = routes.map((route) => {
        const { substringLoc, addMethod, pathsToIgnore } = options;

        const routeSubstring = substringLoc
            ? route.path.substring(substringLoc)
            : route.path;

        if (pathsToIgnore?.includes(routeSubstring)) return route;

        route.options.middlewares[addMethod ?? 'push'](middleware);
        return route;
    });

    return routesToBind;
}
