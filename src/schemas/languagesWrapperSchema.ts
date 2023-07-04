import { z, ZodObject } from 'zod';

export interface ILanguagesSchema {
  en: ZodObject<any>
  pt: ZodObject<any>
}

export default (zodSchema: ZodObject<any>): ZodObject<any> => {
  const languagesZodSchema = z.object({
    en: zodSchema,
    pt: zodSchema
  });

  return languagesZodSchema;
}
