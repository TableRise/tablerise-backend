import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import userGameInfoEnum from 'src/domains/users/enums/userGameInfoEnum';
import { IUsersSchemas } from 'src/types/modules/interface/users/presentation/users/UsersSchemas';
import { z } from 'zod';

const postValidateEmailSendCodeQuerySchema = z.object({
    email: z.email().default(''),
    flow: z.enum(stateFlowsEnum.values).default('reset-two-factor'),
});

const postCreateUserBodySchema = z.object({
    email: z.email(),
    password: z.string().regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
        message: 'Invalid password',
    }),
    nickname: z.string().max(32),
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
    picture: z.file(),
});

const putUpdateUserBodySchema = z.object({
    nickname: z.string().max(32).optional(),
});

const putUpdateUserDetailsBodySchema = z.object({
    firstName: z.string().max(16).optional(),
    lastName: z.string().max(80).optional(),
    birthday: z.string().optional(),
    biography: z.string().max(500).optional(),
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

const patchUpdateEmailBodySchema = z.object({
    email: z.email(),
});

const patchUpdatePasswordBodySchema = z.object({
    email: z.email(),
    password: z
        .string()
        .regex(/^(?=.*[A-Z])(?=.*[!@#$&*])(?=.*\d).{8,32}$/, {
            message: 'Invalid password',
        })
        .default(''),
});

const patchAddUserGameInfoBodySchema = z.object({
    infoId: z.uuidv4(),
    targetInfo: z.enum(userGameInfoEnum.values),
    data: z.any().default({}),
});

const patchRemoveUserGameInfoBodySchema = z.object({
    infoId: z.uuidv4(),
    targetInfo: z.enum(userGameInfoEnum.values),
    data: z.any().default({}),
});

const patchUpdateCampaignNotesQuerySchema = z.object({
    campaignId: z.uuidv4(),
});

const patchUpdateCampaignNotesBodySchema = z.object({
    title: z.string(),
    content: z.string(),
});

const postSupportEmailBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    category: z.string(),
    campaignCode: z.string().optional(),
});

export type TValidateEmailSendCodeQuery = z.infer<typeof postValidateEmailSendCodeQuerySchema>;
export type TCreateUserBody = z.infer<typeof postCreateUserBodySchema>;
export type TLoginBody = z.infer<typeof postLoginBodySchema>;
export type TUpdateUserProfilePictureBody = z.infer<typeof postUpdateUserProfilePictureBodySchema>;
export type TUpdateUserBody = z.infer<typeof putUpdateUserBodySchema>;
export type TUpdateUserDetailsBody = z.infer<typeof putUpdateUserDetailsBodySchema>;
export type TAuthenticateEmailQuery = z.infer<typeof postAuthenticateEmailQuerySchema>;
export type TAuthenticate2FAQuery = z.infer<typeof postAuthenticate2FAQuerySchema>;
export type TUpdateEmailBody = z.infer<typeof patchUpdateEmailBodySchema>;
export type TUpdatePasswordBody = z.infer<typeof patchUpdatePasswordBodySchema>;
export type TAddUserGameInfoBody = z.infer<typeof patchAddUserGameInfoBodySchema>;
export type TRemoveUserGameInfoBody = z.infer<typeof patchRemoveUserGameInfoBodySchema>;
export type TUpdateCampaignNotesQuery = z.infer<typeof patchUpdateCampaignNotesQuerySchema>;
export type TUpdateCampaignNotesBody = z.infer<typeof patchUpdateCampaignNotesBodySchema>;
export type TPostSupportEmailBody = z.infer<typeof postSupportEmailBodySchema>;

export default (): IUsersSchemas => ({
    postValidateEmailSendCode: {
        query: postValidateEmailSendCodeQuerySchema,
    },
    postCreateUser: {
        body: postCreateUserBodySchema,
    },
    postLogin: {
        body: postLoginBodySchema,
    },
    postSupportEmail: {
        body: postSupportEmailBodySchema,
    },
    postUpdateUserProfilePicture: {
        body: postUpdateUserProfilePictureBodySchema,
    },
    putUpdateUser: {
        body: putUpdateUserBodySchema,
    },
    putUpdateUserDetails: {
        body: putUpdateUserDetailsBodySchema,
    },
    postAuthenticateEmail: {
        query: postAuthenticateEmailQuerySchema,
    },
    postAuthenticate2FA: {
        query: postAuthenticate2FAQuerySchema,
    },
    patchUpdateEmail: {
        body: patchUpdateEmailBodySchema,
    },
    patchUpdatePassword: {
        body: patchUpdatePasswordBodySchema,
    },
    patchAddUserGameInfo: {
        body: patchAddUserGameInfoBodySchema,
    },
    patchRemoveUserGameInfo: {
        body: patchRemoveUserGameInfoBodySchema,
    },
    patchUpdateCampaignNotes: {
        query: patchUpdateCampaignNotesQuerySchema,
        body: patchUpdateCampaignNotesBodySchema,
    },
});
