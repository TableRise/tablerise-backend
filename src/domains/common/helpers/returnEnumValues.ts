export default function (enumerator: any): [string, ...string[]] {
    const values = Object.values(enumerator);
    return values as [string, ...string[]];
}
