import { routeInstance } from '@tablerise/auto-swagger';

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
