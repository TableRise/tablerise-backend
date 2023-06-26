import { IRoutesDeclareParams } from 'src/types/IRoute';

export default function generateIDParam(): IRoutesDeclareParams[] {
  return [{
    name: '_id',
    location: 'path',
    required: true,
    type: 'string'
  }];
};

export function generateQueryParam(count: number, names: string[]): IRoutesDeclareParams[] {
  const params = []

  const idxCount = count - 1;

  for (let index = 0; index <= idxCount; index += 1) {
    params.push({
      name: names[index],
      location: 'query',
      required: true,
      type: 'string'
    });
  }

  return params;
};
