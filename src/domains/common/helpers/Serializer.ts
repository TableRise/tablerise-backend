import Google from 'passport-google-oauth20';
import Facebook from 'passport-facebook';
import Discord from 'passport-discord';
import User, { UserDetail } from '@tablerise/database-management/dist/src/interfaces/User';
import { UserExternal } from 'src/types/api/users/http/payload';
import Campaign from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ApiImgBBResponse } from 'src/types/modules/infra/clients/ImageStorageClient';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';
import { CharactersDnd } from '@tablerise/database-management/dist/src/interfaces/CharactersDnd';

export default class Serializer {
    private isDiscordProfile(obj: any): obj is Discord.Profile {
        return 'provider' in obj && obj.provider === 'discord';
    }

    private isGoogleProfile(obj: any): obj is Google.Profile {
        return 'provider' in obj && obj.provider === 'google';
    }

    public externalUser(userProfile: Google.Profile | Facebook.Profile | Discord.Profile): UserExternal {
        const user: UserExternal = {
            providerId: userProfile.id,
            email: '',
            name: '',
        };

        if (this.isDiscordProfile(userProfile)) {
            user.name = userProfile.username;
            user.email = userProfile.email as string;
        }

        if (this.isGoogleProfile(userProfile)) {
            user.name = userProfile.displayName;
            user.email = userProfile._json.email as string;
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
    }: any): User {
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
        birthday = null,
        gameInfo = { campaigns: [], characters: [], badges: [], bannedCampaigns: [] },
        biography = null,
        rank = null,
        role = 'user',
        cover = null,
    }: any): UserDetail {
        return {
            userDetailId,
            userId,
            firstName,
            lastName,
            birthday,
            gameInfo,
            biography,
            rank,
            cover,
            role,
        };
    }

    public postCampaign({
        campaignId = null,
        title = null,
        cover = null,
        code = null,
        description = null,
        system = null,
        ageRestriction = null,
        campaignPlayers = null,
        visibility = null,
        matchData = null,
        musics = null,
        buys = [],
        infos = {
            campaignAge: '1',
            nextMatchDate: '',
            announcements: [],
            visibility,
        },
        nextMatchDate = null,
        password = null,
        lore = null,
        playerAmountLimit = null,
        socialMedia = null,
        configurations = { xpSystem: false, shopSystem: false },
        mainHistory = null,
        createdAt = null,
        updatedAt = null,
    }: any): Campaign & {
        lore?: string;
        nextMatchDate?: string;
        playerAmountLimit?: string;
        socialMedia?: { discord?: string; twitter?: string; youtube?: string } | string;
        configurations?: Campaign['configurations'];
        code: string;
    } {
        return {
            campaignId,
            title,
            cover,
            code,
            description,
            system,
            nextMatchDate,
            ageRestriction,
            campaignPlayers,
            mainHistory,
            matchData,
            musics,
            buys,
            infos,
            password,
            playerAmountLimit,
            lore,
            socialMedia,
            configurations,
            createdAt,
            updatedAt,
        };
    }

    public postCharacter({
        characterId = null,
        campaignId = null,
        matchId = null,
        author = null,
        data = null,
        npc = null,
        picture = null,
        logs = null,
    }: any): Partial<CharactersDnd> {
        return {
            characterId,
            campaignId,
            matchId,
            author,
            data,
            npc,
            picture,
            logs,
        };
    }

    public imageResult(result: ApiImgBBResponse): ImageObject {
        const { data } = result;

        const { id, title, url, time, thumb, medium, delete_url: deleteUrl } = data.data;

        const dataSerialized = {} as any;

        dataSerialized.id = id || '';
        dataSerialized.title = title || '';
        dataSerialized.link = url || '';
        dataSerialized.uploadDate = time ? new Date(time).toISOString() : new Date().toISOString();
        dataSerialized.thumbSizeUrl = thumb.url || '';
        dataSerialized.mediumSizeUrl = medium?.url || '';
        dataSerialized.deleteUrl = deleteUrl || '';
        dataSerialized.request = { success: result.success, status: result.status };

        return dataSerialized;
    }
}
