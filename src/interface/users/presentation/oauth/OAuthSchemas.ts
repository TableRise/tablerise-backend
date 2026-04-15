import { IOAuthSchemas } from 'src/types/modules/interface/users/presentation/oauth/OAuthSchemas';
import { z } from 'zod';

const postCompleteOauthRegisterBodySchema = z.object({
    nickname: z.string().max(32),
    firstName: z.string().max(16),
    lastName: z.string().max(80),
    birthday: z.string(),
});

export type TCompleteOauthRegisterBody = z.infer<typeof postCompleteOauthRegisterBodySchema>;

export default (): IOAuthSchemas => ({
    postCompleteOauthRegister: {
        body: postCompleteOauthRegisterBodySchema,
    },
});
