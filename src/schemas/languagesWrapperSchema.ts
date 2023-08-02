import { z, ZodObject } from 'zod';

export interface Internacional<T> {
    _id?: string;
    active?: boolean;
    en: T;
    pt: T;
}

export default (zodSchema: ZodObject<any>): ZodObject<any> => {
    const languagesZodSchema = z.object({
        en: zodSchema,
        pt: zodSchema,
    });

    return languagesZodSchema;
};
