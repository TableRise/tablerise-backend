import systemRoutes from 'src/routes/systemRoutes';
import IRoute, { IRoutesDeclareParams } from 'src/types/IRoute';
import mocks from 'src/support/schemas';
import IMock from 'src/types/IMock';

export type IRoutesWrapperDeclared = string | null | IRoutesDeclareParams[] | IMock | boolean

const systemInstance = mocks.system.instance as IMock;
const updateSystemContentInstance = mocks.updateSystemContent.instance as IMock;

class RoutesWrapper {
  static declareRoutes(): IRoutesWrapperDeclared[][] {
    return [
      ['/systems', 'system', 'get', null, systemInstance, false],
      ['/systems/{_id}', 'system', 'get', [{
        name: '_id',
        location: 'path',
        required: true,
        type: 'string'
      }], systemInstance, false],
      ['/systems/{_id}', 'system', 'put', [{
        name: '_id',
        location: 'path',
        required: true,
        type: 'string'
      }], systemInstance, false],
      ['/systems/{_id}', 'system', 'patch', [
        {
          name: '_id',
          location: 'path',
          required: true,
          type: 'string'
        },
        {
          name: 'entity',
          location: 'query',
          required: true,
          type: 'string'
        }
      ], updateSystemContentInstance, false]
    ];
  }

  static routes(): IRoute {
    return {
      systems: systemRoutes
    }
  }
};

export default RoutesWrapper;
