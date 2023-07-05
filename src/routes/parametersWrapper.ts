import { RouteDeclareParams } from 'src/types/Route';

export default function generateIDParam(): RouteDeclareParams[] {
  return [{
    name: '_id',
    location: 'path',
    required: true,
    type: 'string'
  }];
};

export function generateQueryParam(count: number, names: string[]): RouteDeclareParams[] {
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
