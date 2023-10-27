import { ParamName, RouteDeclareParams } from 'src/types/requests/Route';

export default function generateIDParam(): RouteDeclareParams[] {
    return [
        {
            name: 'id',
            location: 'path',
            required: true,
            type: 'string',
        },
    ];
}

export function generateQueryParam(
    count: number,
    names: ParamName[]
): RouteDeclareParams[] {
    const params = [];

    const idxCount = count - 1;

    for (let index = 0; index <= idxCount; index += 1) {
        params.push({
            name: names[index].name,
            location: 'query',
            required: names[index].required !== 'off',
            type: names[index].type,
        });
    }

    return params as RouteDeclareParams[];
}

export function generateHeaderParam(
    count: number,
    names: ParamName[]
): RouteDeclareParams[] {
    const params = [];

    const idxCount = count - 1;

    for (let index = 0; index <= idxCount; index += 1) {
        params.push({
            name: names[index].name,
            location: 'header',
            required: true,
            type: names[index].type,
        });
    }

    return params;
}
