import { routeInstance } from '@tablerise/auto-swagger';
import { Router } from 'express';

export default interface Route {
    'dungeons&dragons5e': {
        armors: Router;
        backgrounds: Router;
        // system: Router;
        realms: Router;
        gods: Router;
        feats: Router;
        // weapons: Router;
        items: Router;
        races: Router;
        classes: Router;
        magicItems: Router;
        spells: Router;
        // wikis: Router;
        monsters: Router;
    };
    user: {
        oAuth: Router;
        profile: Router;
    };
    campaign: {
        campaign: Router;
    };
}

export interface RouteDeclarations {
    'dungeons&dragons5e': routeInstance[];
    user: routeInstance[];
    campaign: routeInstance[];
}
