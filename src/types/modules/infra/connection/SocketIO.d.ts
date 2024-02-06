import { Logger } from 'src/types/shared/logger';

export interface SocketIOContract {
    logger: Logger;
}
export interface SocketRoomInfo {
    objects: any[];
    images: any[];
    background: string;
}

export type SocketRooms = Record<string, SocketRoomInfo>;

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
