import { Logger } from 'src/types/shared/logger';

export interface SocketIOContract {
    logger: Logger;
}

export interface SocketRoomInfo {
    objects: any[];
    images: any[];
}

export type SocketRooms = Record<string, SocketRoomInfo>;
