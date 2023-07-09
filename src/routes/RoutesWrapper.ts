/* eslint-disable max-len */
import systemRoutes from 'src/routes/systemRoutes';
import realmRoutes from 'src/routes/realmRoutes';
import godRoutes from 'src/routes/godRoutes';

import Route, { RouteWrapperDeclared } from 'src/types/Route';

import mocks from 'src/support/mocks';

import { System } from 'src/schemas/systemValidationSchema';
import { Internacional } from 'src/schemas/languagesWrapperSchema';
import { Realm } from 'src/schemas/realmsValidationSchema';
import { God } from 'src/schemas/godsValidationSchema';

import generateIDParam, { generateQueryParam } from './parametersWrapper';

const systemInstance = mocks.system;
const { _id: _, content: __, ...systemWithoutContent } = systemInstance.instance as System;
const updateSystemInstance = mocks.updateSystemContent;

const realmInstance = mocks.realm;
const { _id: _1, ...realmWithoutId } = realmInstance.instance as Internacional<Realm>;

const godInstance = mocks.god;
const { _id: _2, ...godWithoutId } = godInstance.instance as Internacional<God>;

class RoutesWrapper {
  static routes(): Route {
    return {
      system: systemRoutes,
      realms: realmRoutes,
      gods: godRoutes
    }
  }

  static declareRoutes(): RouteWrapperDeclared[][] {
    return [
      // RPG systems routes
      ['/system', 'system', 'get', null, systemInstance, null, false],
      ['/system/{_id}', 'system', 'get', generateIDParam(), systemInstance, null, false],
      ['/system/{_id}', 'system', 'put', generateIDParam(), systemInstance, systemWithoutContent, false],
      ['/system/{_id}', 'system', 'patch', [
        ...generateIDParam(),
        ...generateQueryParam(1, ['entity'])
      ], null, updateSystemInstance.instance, false],
      ['/system/activate/{_id}', 'system', 'patch', generateIDParam(), null, null, false],
      ['/system/deactivate/{_id}', 'system', 'patch', generateIDParam(), null, null, false],

      // RPG realms routes
      ['/realms', 'realms', 'get', null, realmInstance, null, false],
      ['/realms/{_id}', 'realms', 'get', generateIDParam(), realmInstance, null, false],
      ['/realms/{_id}', 'realms', 'put', generateIDParam(), realmInstance, realmWithoutId, false],
      ['/realms/{_id}', 'realms', 'delete', generateIDParam(), null, null, false],

      // RPG gods routes
      ['/gods', 'gods', 'get', null, realmInstance, null, false],
      ['/gods/{_id}', 'gods', 'get', generateIDParam(), realmInstance, null, false],
      ['/gods/{_id}', 'gods', 'put', generateIDParam(), realmInstance, godWithoutId, false],
      ['/gods/{_id}', 'gods', 'delete', generateIDParam(), null, null, false]
    ];
  }
};

export default RoutesWrapper;
