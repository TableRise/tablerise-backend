import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import pronounEnum from 'src/domains/users/enums/pronounEnum';
import questionEnum from 'src/domains/users/enums/questionEnum';
import userGameInfoEnum from 'src/domains/users/enums/userGameInfoEnum';
import { IUsersSchemas } from 'src/types/modules/interface/users/presentation/users/UsersSchemas';
import { z } from 'zod';

const postValidateEmailSendCodeQuerySchema = z.object({
    email: z.email().default(''),
    flow: z.enum(stateFlowsEnum.values).default('reset-two-factor'),
});

const postCreateUserBodySchema = z.object({
    email: z.email().default(''),
    password: z
        .string()
        .regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
            message: 'Invalid password',
        })
        .default(''),
    nickname: z.string().max(32).default(''),
});

const postLoginBodySchema = z.object({
    email: z.email().default(''),
    password: z
        .string()
        .regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
            message: 'Invalid password',
        })
        .default(''),
});

const postUpdateUserProfilePictureBodySchema = z.object({
    picture: z.instanceof(File),
});

const putUpdateUserBodySchema = z.object({
    nickname: z.string().max(32).optional(),
    details: z.object({
        firstName: z.string().max(16).optional(),
        lastName: z.string().max(80).optional(),
        pronoun: z.enum(pronounEnum.values).optional(),
        birthday: z.string().optional(),
        biography: z.string().max(500).optional(),
    }),
});

const postAuthenticateEmailQuerySchema = z.object({
    email: z.email().default(''),
    code: z.string().max(6).default(''),
    flow: z.enum(stateFlowsEnum.values).default('reset-two-factor'),
});

const postAuthenticate2FAQuerySchema = z.object({
    email: z.email().default(''),
    token: z.string().max(6).default(''),
    flow: z.enum(stateFlowsEnum.values).default('reset-two-factor'),
});

const postAuthenticateSecretQuestionQuerySchema = z.object({
    email: z.email().default(''),
    flow: z.enum(stateFlowsEnum.values).default('reset-two-factor'),
});

const postAuthenticateSecretQuestionBodySchema = z.object({
    question: z.enum(questionEnum.values),
    answer: z.string().max(80),
});

const patchUpdateEmailBodySchema = z.object({
    email: z.email(),
});

const patchUpdatePasswordBodySchema = z.object({
    password: z
        .string()
        .regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
            message: 'Invalid password',
        })
        .default(''),
});

const patchUpdateUserGameInfoBodySchema = z.object({
    infoId: z.uuidv4(),
    targetInfo: z.enum(userGameInfoEnum.values),
    operation: z.enum(['add', 'remove']),
    data: z.any().default({}),
});

export type TValidateEmailSendCodeQuery = z.infer<typeof postValidateEmailSendCodeQuerySchema>;
export type TCreateUserBody = z.infer<typeof postCreateUserBodySchema>;
export type TLoginBody = z.infer<typeof postLoginBodySchema>;
export type TUpdateUserProfilePictureBody = z.infer<typeof postUpdateUserProfilePictureBodySchema>;
export type TUpdateUserBody = z.infer<typeof putUpdateUserBodySchema>;
export type TAuthenticateEmailQuery = z.infer<typeof postAuthenticateEmailQuerySchema>;
export type TAuthenticate2FAQuery = z.infer<typeof postAuthenticate2FAQuerySchema>;
export type TAuthenticateSecretQuestionBody = z.infer<typeof postAuthenticateSecretQuestionBodySchema>;
export type TAuthenticateSecretQuestionQuery = z.infer<typeof postAuthenticateSecretQuestionQuerySchema>;
export type TActivateSecretQuestionBody = z.infer<typeof postAuthenticateSecretQuestionQuerySchema>;
export type TSecretQuestionUpdateBody = z.infer<typeof postAuthenticateSecretQuestionBodySchema>;
export type TUpdateEmailBody = z.infer<typeof patchUpdateEmailBodySchema>;
export type TUpdatePasswordBody = z.infer<typeof patchUpdatePasswordBodySchema>;
export type TUpdateUserGameInfoBody = z.infer<typeof patchUpdateUserGameInfoBodySchema>;

export default (): IUsersSchemas => ({
    postValidateEmailSendCode: {
        query: postValidateEmailSendCodeQuerySchema,
        example: z.toJSONSchema(postValidateEmailSendCodeQuerySchema).properties,
    },
    postCreateUser: {
        body: postCreateUserBodySchema,
        example: z.toJSONSchema(postCreateUserBodySchema).properties,
    },
    postLogin: {
        body: postLoginBodySchema,
        example: z.toJSONSchema(postLoginBodySchema).properties,
    },
    postUpdateUserProfilePicture: {
        body: postUpdateUserProfilePictureBodySchema,
        example: { picture: { isBinary: true } },
    },
    putUpdateUser: {
        body: putUpdateUserBodySchema,
        example: z.toJSONSchema(putUpdateUserBodySchema).properties,
    },
    postAuthenticateEmail: {
        query: postAuthenticateEmailQuerySchema,
        example: z.toJSONSchema(postAuthenticateEmailQuerySchema).properties,
    },
    postAuthenticate2FA: {
        query: postAuthenticate2FAQuerySchema,
        example: z.toJSONSchema(postAuthenticate2FAQuerySchema).properties,
    },
    postAuthenticateSecretQuestion: {
        query: postAuthenticateSecretQuestionQuerySchema,
        body: postAuthenticateSecretQuestionBodySchema,
        example: z.toJSONSchema(postAuthenticateSecretQuestionBodySchema).properties,
    },
    patchActivateSecretQuestion: {
        body: postAuthenticateSecretQuestionBodySchema,
        example: z.toJSONSchema(postAuthenticateSecretQuestionBodySchema).properties,
    },
    patchSecretQuestionUpdate: {
        body: postAuthenticateSecretQuestionBodySchema,
        example: z.toJSONSchema(postAuthenticateSecretQuestionBodySchema).properties,
    },
    patchUpdateEmail: {
        body: patchUpdateEmailBodySchema,
        example: z.toJSONSchema(patchUpdateEmailBodySchema).properties,
    },
    patchUpdatePassword: {
        body: patchUpdatePasswordBodySchema,
        example: z.toJSONSchema(patchUpdatePasswordBodySchema).properties,
    },
    patchUpdateUserGameInfo: {
        body: patchUpdateUserGameInfoBodySchema,
        example: z.toJSONSchema(patchUpdateUserGameInfoBodySchema).properties,
    },
});
