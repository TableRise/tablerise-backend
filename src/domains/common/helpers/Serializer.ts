import Google from 'passport-google-oauth20';
import Facebook from 'passport-facebook';
import Discord from 'passport-discord';
import { UserDetailInstance } from 'src/domains/users/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import { UserExternal } from 'src/types/api/users/http/payload';
import { CampaignInstance } from 'src/domains/campaigns/schemas/campaignsValidationSchema';
import { ApiImgBBResponse } from 'src/types/modules/infra/clients/ImageStorageClient';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

export default class Serializer {
    private _isDiscordProfile(obj: any): obj is Discord.Profile {
        return 'provider' in obj && obj.provider === 'discord';
    }

    private _isGoogleProfile(obj: any): obj is Google.Profile {
        return 'provider' in obj && obj.provider === 'google';
    }

    private _isFacebookProfile(obj: any): obj is Facebook.Profile {
        return 'provider' in obj && obj.provider === 'facebook';
    }

    public externalUser(
        userProfile: Google.Profile | Facebook.Profile | Discord.Profile
    ): UserExternal {
        const user: UserExternal = {
            providerId: userProfile.id,
            email: '',
            name: '',
        };

        if (this._isDiscordProfile(userProfile)) {
            user.name = userProfile.username;
            user.email = userProfile.email as string;
        }

        if (this._isGoogleProfile(userProfile) || this._isFacebookProfile(userProfile)) {
            user.name = userProfile.displayName;
            user.email = userProfile._json.email;
        }

        return user;
    }

    public postUser({
        userId = null,
        providerId = null,
        email = null,
        password = null,
        inProgress = null,
        nickname = null,
        tag = null,
        picture = null,
        twoFactorSecret = null,
        createdAt = null,
        updatedAt = null,
    }: any): UserInstance {
        return {
            userId,
            providerId,
            email,
            password,
            inProgress,
            nickname,
            tag,
            picture,
            twoFactorSecret,
            createdAt,
            updatedAt,
        };
    }

    public postUserDetails({
        userDetailId = null,
        userId = null,
        firstName = null,
        lastName = null,
        pronoun = null,
        secretQuestion = null,
        birthday = null,
        gameInfo = { campaigns: [], characters: [], badges: [] },
        biography = null,
        role = 'user',
    }: any): UserDetailInstance {
        return {
            userDetailId,
            userId,
            firstName,
            lastName,
            pronoun,
            secretQuestion,
            birthday,
            gameInfo,
            biography,
            role,
        };
    }

    public postCampaign({
        campaignId = null,
        title = null,
        cover = null,
        description = null,
        system = null,
        ageRestriction = null,
        campaignPlayers = null,
        visibility = null,
        matchData = null,
        infos = {
            campaignAge: '1',
            matchDates: [],
            announcements: [],
            visibility,
        },
        lores = null,
        createdAt = null,
        updatedAt = null,
    }: any): CampaignInstance {
        return {
            campaignId,
            title,
            cover,
            description,
            system,
            ageRestriction,
            campaignPlayers,
            matchData,
            infos,
            lores,
            createdAt,
            updatedAt,
        };
    }

    public imageResult(result: ApiImgBBResponse): ImageObject {
        const { data } = result;
        const { thumb, medium, delete_url: deleteUrl } = data;

        const dataSerialized = {} as any;

        dataSerialized.id = data.id || '';
        dataSerialized.title = data.title || '';
        dataSerialized.link = data.url || '';
        dataSerialized.uploadDate = data.time
            ? new Date(data.time).toISOString()
            : new Date().toISOString();
        dataSerialized.thumbSizeUrl = thumb.url || '';
        dataSerialized.mediumSizeUrl = medium.url || '';
        dataSerialized.deleteUrl = deleteUrl || '';
        dataSerialized.request = { success: result.success, status: result.status };

        return dataSerialized;
    }
}
