import userZod, {
    emailUpdateZodSchema,
    passwordUpdateZodSchema,
} from './usersValidationSchema';
import userDetailZod from './userDetailsValidationSchema';
import { oAuthCompleteZodSchema } from './oAuthValidationSchema';

const schemas = {
    userZod,
    userDetailZod,
    emailUpdateZod: emailUpdateZodSchema,
    passwordUpdateZod: passwordUpdateZodSchema,
    oAuthComplete: oAuthCompleteZodSchema,
};

export type SchemasUserType = typeof schemas;

export default schemas;
