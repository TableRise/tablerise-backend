import { routeInstance } from '@tablerise/auto-swagger';
import { Router } from 'express';

export default interface Route {
    'dungeons&dragons5e': {
        backgrounds: Router;
        feats: Router;
        races: Router;
        classes: Router;
        equipment: Router;
        spells: Router;
    };
    user: {
        oAuth: Router;
        users: Router;
    };
    campaign: {
        campaign: Router;
    };
    character: {
        character: Router;
    };
}

export interface RouteDeclarations {
    'dungeons&dragons5e': routeInstance[];
    user: routeInstance[];
    campaign: routeInstance[];
    character: routeInstance[];
}
