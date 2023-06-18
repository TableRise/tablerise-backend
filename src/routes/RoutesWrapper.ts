import systemRoutes from 'src/routes/systemRoutes';
import IRoute, { IRoutesDeclareParams } from 'src/types/IRoute';
import mocks from 'src/support/schemas';
import IMock from 'src/types/IMock';

export type IRoutesWrapperDeclared = string | null | IRoutesDeclareParams[] | IMock | boolean

const systemInstance = mocks.system.instance as IMock;

class RoutesWrapper {
  static declareRoutes(): IRoutesWrapperDeclared[][] {
    return [
      ['/systems', 'system', 'get', null, systemInstance, false],
      ['/systems/{id}', 'system', 'getByID', [{
        name: '_id',
        location: 'path',
        required: true,
        type: 'string'
      }], systemInstance, false]
    ];
  }

  static routes(): IRoute {
    return {
      systems: systemRoutes
    }
  }
};

export default RoutesWrapper;
