import { Router } from 'express';
import IMock from 'src/types/IMock';

export default interface IRoutes {
  systems: Router
}

export interface IRoutesDeclareParams {
  name: string
  location: string
  required: boolean
  type: string
}

export type IRoutesWrapperDeclared = string | null | IRoutesDeclareParams[] | IMock | boolean | unknown
