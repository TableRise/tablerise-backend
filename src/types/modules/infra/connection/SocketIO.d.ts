import { MatchData } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { Socket } from 'socket.io';
import CampaignsRepository from 'src/infra/repositories/campaign/CampaignsRepository';
import { Logger } from 'src/types/shared/logger';

export interface SocketIOContract {
    campaignsRepository: CampaignsRepository;
    logger: Logger;
}

export interface MatchCharacter {
    character_id: string;
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

export type SocketMatches = Record<string, MatchData & { campaignId: string }>;

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

export interface addCharacterSocketEventPayload {
    matchId: string;
    userId: string;
    campaignId: string;
    characterId: string | null;
}

export interface moveCharacterSocketEventPayload {
    matchId: string;
    characterId: string;
    coordinates: Coordinates;
    socketId: string;
}

export interface deleteCharacterSocketEventPayload {
    matchId: string;
    characterId: string;
}

export interface disconnectCharacterSocketEvent {
    matchId: string;
    campaignId: string;
    userId: string;
}

export interface changeMusicSocketEventPayload {
    matchId: string;
    musicId: string;
}

export interface endMatchSocketEventPayload {
    matchId: string;
    campaignId: string;
}

export interface setCharacterPictureSocketEventPayload {
    matchId: string;
    characterId: string;
}

export interface changeCharacterStatusSocketEventPayload {
    matchId: string;
    characterId: string;
    status: 'alive' | 'dead' | 'viewer';
}

export interface rollDiceSocketEventPayload {
    matchId: string;
    userId: string;
    notation: string;
    result: number;
}

export interface addLogSocketEventPayload {
    matchId: string;
    content: string;
}
