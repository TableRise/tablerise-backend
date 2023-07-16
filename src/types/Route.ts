import { Router } from 'express';
import Mock from 'src/types/Mock';

export default interface IRoutes {
  system: Router
  realms: Router
  gods: Router
  backgrounds: Router
  feats: Router
}

export interface RouteDeclareParams {
  name: string
  location: string
  required: boolean
  type: string
}

export type RouteWrapperDeclared = string | null | RouteDeclareParams[] | Mock | boolean | unknown
