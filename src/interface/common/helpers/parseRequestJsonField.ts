export default function parseRequestJsonField<T>(value: unknown): T | undefined {
    if (value === undefined || value === null || value === '') {
        return undefined;
    }

    if (typeof value !== 'string') {
        return value as T;
    }

    try {
        return JSON.parse(value) as T;
    } catch {
        return value as T;
    }
}
