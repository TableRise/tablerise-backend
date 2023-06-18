import systemRoutes from 'src/routes/systemRoutes';
import IRoute, { IRoutesDeclareParams } from 'src/types/IRoute';
import entitiesMock from 'src/support/schemas/systemsMocks';
import IMock from 'src/types/IMock';

type IRoutesWrapperDeclared = string | null | IRoutesDeclareParams[] | IMock | boolean

class RoutesWrapper {
  static declareRoutes(): IRoutesWrapperDeclared[][] {
    return [
      ['/systems', 'system', 'get', null, entitiesMock.SYSTEM_INSTANCE_MOCK, false],
      ['/systems/{id}', 'system', 'getByID', [{
        name: '_id',
        location: 'path',
        required: true,
        type: 'string'
      }], entitiesMock.SYSTEM_INSTANCE_MOCK, false]
    ];
  }

  static routes(): IRoute {
    return {
      systems: systemRoutes
    }
  }
};

export default RoutesWrapper;
