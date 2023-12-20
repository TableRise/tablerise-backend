import userZod, {
    emailUpdateZodSchema,
    passwordUpdateZodSchema,
    updateUserZodSchema,
} from './usersValidationSchema';
import userDetailZod from './userDetailsValidationSchema';
import { oAuthCompleteZodSchema } from './oAuthValidationSchema';

const schemas = {
    userZod,
    userDetailZod,
    emailUpdateZod: emailUpdateZodSchema,
    passwordUpdateZod: passwordUpdateZodSchema,
    updateUserZod: updateUserZodSchema,
    oAuthComplete: oAuthCompleteZodSchema,
};

export type SchemasUserType = typeof schemas;

export default schemas;
