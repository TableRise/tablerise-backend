import stateFlowsEnum from 'src/domains/common/enums/stateFlowsEnum';
import { optionalImageObjectZodSchema } from 'src/domains/common/schemas/commonValidationSchema';
import { IUsersSchemas } from 'src/types/modules/interface/users/presentation/users/UsersSchemas';
import { z } from 'zod';
import uploadedFileSchema from 'src/interface/common/helpers/uploadedFileSchema';

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

const getUserByNicknameAndTagQuerySchema = z.object({
    nickname: z.string().refine((value) => {
        const hashIndex = value.lastIndexOf('#');

        if (hashIndex <= 0) return false;

        const nickname = value.slice(0, hashIndex);
        const tag = value.slice(hashIndex + 1);

        return nickname.length > 0 && nickname.length <= 32 && /^\d{1,4}$/.test(tag);
    }, 'Invalid nickname handle'),
});

const postUpdateUserProfilePictureBodySchema = z
    .object({
        picture: uploadedFileSchema.optional(),
        imageObject: optionalImageObjectZodSchema,
    })
    .refine((payload) => payload.picture !== undefined || payload.imageObject !== undefined, {
        message: 'Either picture or imageObject is required',
        path: ['picture'],
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

const patchUpdateUserCoverBodySchema = z
    .object({
        image: uploadedFileSchema.optional(),
        imageObject: optionalImageObjectZodSchema,
    })
    .refine((payload) => payload.image !== undefined || payload.imageObject !== undefined, {
        message: 'Either image or imageObject is required',
        path: ['image'],
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

const patchUpdatePasswordQuerySchema = z.object({
    email: z.email(),
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

const postDonateQuerySchema = z.object({
    validation: z.preprocess((value) => {
        if (value === 'true') return true;
        if (value === 'false') return false;
        return value;
    }, z.boolean()),
});

const postDonateBodySchema = z.object({
    value: z.number(),
    timestamp: z.string().refine((value) => !Number.isNaN(Date.parse(value)), {
        message: 'Invalid timestamp',
    }),
    nickname: z.string().max(32).optional(),
    userId: z.uuidv4(),
});

const postMessageBodySchema = z.object({
    title: z.string(),
    content: z.string(),
    targetUserId: z.uuidv4(),
});

const patchAcceptFriendQuerySchema = z.object({
    decline: z.preprocess((value) => {
        if (typeof value === 'string') return value === 'true';
        return value;
    }, z.boolean().default(false)),
});

export type TValidateEmailSendCodeQuery = z.infer<typeof postValidateEmailSendCodeQuerySchema>;
export type TCreateUserBody = z.infer<typeof postCreateUserBodySchema>;
export type TLoginBody = z.infer<typeof postLoginBodySchema>;
export type TGetUserByNicknameAndTagQuery = z.infer<typeof getUserByNicknameAndTagQuerySchema>;
export type TUpdateUserProfilePictureBody = z.infer<typeof postUpdateUserProfilePictureBodySchema>;
export type TUpdateUserBody = z.infer<typeof putUpdateUserBodySchema>;
export type TUpdateUserDetailsBody = z.infer<typeof putUpdateUserDetailsBodySchema>;
export type TAuthenticateEmailQuery = z.infer<typeof postAuthenticateEmailQuerySchema>;
export type TAuthenticate2FAQuery = z.infer<typeof postAuthenticate2FAQuerySchema>;
export type TUpdateEmailBody = z.infer<typeof patchUpdateEmailBodySchema>;
export type TUpdateUserCoverBody = z.infer<typeof patchUpdateUserCoverBodySchema>;
export type TUpdatePasswordBody = z.infer<typeof patchUpdatePasswordBodySchema>;
export type TUpdateCampaignNotesQuery = z.infer<typeof patchUpdateCampaignNotesQuerySchema>;
export type TUpdateCampaignNotesBody = z.infer<typeof patchUpdateCampaignNotesBodySchema>;
export type TPostSupportEmailBody = z.infer<typeof postSupportEmailBodySchema>;
export type TRegisterDonationQuery = z.infer<typeof postDonateQuerySchema>;
export type TRegisterDonationBody = z.infer<typeof postDonateBodySchema>;
export type TPostMessageBody = z.infer<typeof postMessageBodySchema>;
export type TAcceptFriendQuery = z.infer<typeof patchAcceptFriendQuerySchema>;

export default (): IUsersSchemas => ({
    getUserByNicknameAndTag: {
        query: getUserByNicknameAndTagQuerySchema,
    },
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
    postDonate: {
        query: postDonateQuerySchema,
        body: postDonateBodySchema,
    },
    postMessage: {
        body: postMessageBodySchema,
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
    patchUpdateUserCover: {
        body: patchUpdateUserCoverBodySchema,
    },
    patchUpdatePassword: {
        query: patchUpdatePasswordQuerySchema,
        body: patchUpdatePasswordBodySchema,
    },
    patchUpdateCampaignNotes: {
        query: patchUpdateCampaignNotesQuerySchema,
        body: patchUpdateCampaignNotesBodySchema,
    },
    patchAcceptFriend: {
        query: patchAcceptFriendQuerySchema,
    },
});
