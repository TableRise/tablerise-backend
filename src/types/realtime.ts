import Campaign, {
    CharacterInGame,
    Journal,
    Log,
    Music,
    Player,
} from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

export type CampaignRole = Player['role'];
export type MatchEffect = 'dark' | 'light' | 'rain' | null;

export interface MatchToken {
    tokenId: string;
    characterId: string;
    isClone: boolean;
    xPct: number;
    yPct: number;
    widthPct: number;
    createdBy: string;
    updatedBy: string;
    createdAt: string;
    updatedAt: string;
}

export interface MatchState {
    activeMapId: string | null;
    gridVisible: boolean;
    activeEffect: MatchEffect;
    playingMusicId: string | null;
    visibleCharacterIds: string[];
    tokens: MatchToken[];
}

export interface RealtimeMatchData {
    matchId: string;
    prevDate: string;
    nextSessionResume?: string;
    confirmedPlayers: Player[];
    mapImages: ImageObject[];
    logs: Log[];
    state: MatchState;
    characters?: CharacterInGame[];
    charactersInGame?: CharacterInGame[];
    musics?: Music[];
    actualMapImage?: ImageObject;
}

export interface RealtimeCampaign extends Omit<Campaign, 'matchData'> {
    matchData: RealtimeMatchData;
}

export interface ConnectedUserPresence {
    userId: string;
    role: CampaignRole;
}

export interface CampaignSyncPayload {
    campaignId: string;
    serverTime: string;
    presence: {
        connectedUsers: ConnectedUserPresence[];
        confirmedPlayers: ConnectedUserPresence[];
    };
    match: {
        activeMap: string | null;
        gridVisible: boolean;
        activeEffect: MatchEffect;
        playingMusicId: string | null;
        visibleCharacterIds: string[];
        tokens: MatchToken[];
        highlightedJournalPost: Journal | null;
    };
}

export interface SocketAckError {
    code: string;
    message: string;
}

export type SocketAck<T = unknown> =
    | {
          ok: true;
          data?: T;
      }
    | {
          ok: false;
          error: SocketAckError;
      };
