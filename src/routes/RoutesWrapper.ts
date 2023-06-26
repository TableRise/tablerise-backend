/* eslint-disable max-len */
import systemRoutes from 'src/routes/systemRoutes';

import IRoute, { IRoutesWrapperDeclared } from 'src/types/IRoute';
import IMock from 'src/types/IMock';

import mocks from 'src/support/mocks';

import { ISystem } from 'src/schemas/systemsValidationSchema';

import generateIDParam, { generateQueryParam } from './parametersWrapper';

const systemInstance = mocks.system.instance as IMock;
const { content: _, ...systemWithoutContent } = systemInstance as unknown as ISystem;
const updateSystemInstance = mocks.updateSystemContent.instance as IMock;

class RoutesWrapper {
  static routes(): IRoute {
    return {
      systems: systemRoutes
    }
  }

  static declareRoutes(): IRoutesWrapperDeclared[][] {
    return [
      ['/systems', 'system', 'get', null, systemInstance, null, false],
      ['/systems/{_id}', 'system', 'get', generateIDParam(), systemInstance, null, false],
      ['/systems/{_id}', 'system', 'put', generateIDParam(), systemInstance, systemWithoutContent, false],
      ['/systems/{_id}', 'system', 'patch',
        [...generateIDParam(), ...generateQueryParam(1, ['entity'])],
        null, updateSystemInstance, false
      ]
    ];
  }
};

export default RoutesWrapper;
