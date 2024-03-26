import { Socket } from 'socket.io';
import { Logger } from 'src/types/shared/logger';

export interface SocketIOContract {
    campaignsRepository: any;
    logger: Logger;
}

export interface MatchAvatar {
    avatar_id: string;
    user_id: string;
    picture: string;
    position: {
        x: number;
        y: number;
    };
    size: {
        width: number;
        height: number;
    };
    status: 'alive' | 'dead' | 'viewer';
}

export interface MatchMusics {
    title: string;
    youtube_link: string;
}

export interface MatchMapImages {
    id: string;
    link: string;
    uploadDate: string;
}

export interface Logs {
    logged_at: string;
    content: string;
}

export interface SocketMatchesInfo {
    match_id: string;
    avatarsInGame: MatchAvatar[];
    avatars?: MatchAvatar[];
    musics: MatchMusics[];
    actual_map_image: MatchMapImages;
    map_images: MatchMapImages[];
    logs: Logs[];
}

export type SocketMatches = Record<string, SocketMatchesInfo>;

export interface SquareSize {
    width: number;
    height: number;
    elementId: string;
}

export interface Coordinates {
    x: number;
    y: number;
    id: string;
}

export interface joinMatchSocketEventPayload {
    campaignId: string;
    socket: Socket;
}

export interface changeMapImageSocketEventPayload {
    matchId: string;
    mapId: string;
}

export interface addAvatarSocketEventPayload {
    matchId: string;
    userId: string;
    campaignId: string;
    avatarId: string | null;
}

export interface moveAvatarSocketEventPayload {
    matchId: string;
    avatarId: string;
    coordinates: Coordinates;
    socketId: string;
}

export interface deleteAvatarSocketEventPayload {
    matchId: string;
    avatarId: string;
}

export interface disconnectAvatarSocketEvent {
    matchId: string;
    campaignId: string;
    userId: string;
}
