import { oAuthCompleteZodSchema } from './oAuthValidationSchema';

const schemas = {
    oAuthComplete: oAuthCompleteZodSchema,
};

export type SchemasUserType = typeof schemas;

export default schemas;
