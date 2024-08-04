import { MatchData } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { Socket } from 'socket.io';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface SocketIOContract {
    campaignsRepository: CampaignsRepository;
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

export type SocketMatches = Record<string, MatchData>;

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
