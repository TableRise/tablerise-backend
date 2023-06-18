import { Router } from 'express';

export default interface IRoutes {
  systems: Router
}

export interface IRoutesDeclareParams {
  name: string
  location: string
  required: boolean
  type: string
}
