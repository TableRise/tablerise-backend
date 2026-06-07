export const getAllowedCorsOrigins = (): string[] =>
    [process.env.CORS_ORIGIN_1, process.env.CORS_ORIGIN_2, process.env.CORS_ORIGIN].filter((origin): origin is string =>
        Boolean(origin)
    );

export const isAllowedCorsOrigin = (origin: string | undefined): boolean => {
    if (!origin) return true;

    return getAllowedCorsOrigins().includes(origin);
};
