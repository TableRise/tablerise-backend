import { routeInstance } from '@tablerise/auto-swagger';
import { Router } from 'express';

export default interface Route {
    'dungeons&dragons5e': {
        armors: Router;
        // system: Router;
        // realms: Router;
        // gods: Router;
        // backgrounds: Router;
        // feats: Router;
        // weapons: Router;
        // items: Router;
        // races: Router;
        // classes: Router;
        // magicItems: Router;
        // spells: Router;
        // wikis: Router;
        // monsters: Router;
    };
    user: {
        oAuth: Router;
        profile: Router;
    };
}

export interface RouteDeclarations {
    'dungeons&dragons5e': routeInstance[];
    user: routeInstance[];
}

export interface RouteDeclareParams {
    name: string;
    location: string;
    required: boolean;
    type: string;
}

export interface ParamName {
    name: string;
    type: string;
    required?: 'off';
}

export type RouteWrapperDeclared = routeInstance;
