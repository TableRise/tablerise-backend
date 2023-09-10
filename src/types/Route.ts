import { routeOriginal } from '@tablerise/auto-swagger';
import { Router } from 'express';
import Mock from 'src/types/Mock';

export default interface Route {
    'dungeons&dragons5e': {
        system: Router;
        realms: Router;
        gods: Router;
        backgrounds: Router;
        feats: Router;
        weapons: Router;
        armors: Router;
        items: Router;
        races: Router;
        classes: Router;
        magicItems: Router;
        spells: Router;
        wikis: Router;
        monsters: Router;
    };
    user: {
        OAuth: Router;
    };
}

export interface RouteDeclarations {
    'dungeons&dragons5e': routeOriginal;
    user: routeOriginal;
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
}

export type RouteWrapperDeclared = string | null | RouteDeclareParams[] | Mock | boolean | unknown;
