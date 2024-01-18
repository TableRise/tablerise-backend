import { Logger } from 'src/types/shared/logger';
import { Server } from 'http';
import socket from 'socket.io';

export interface SocketIOContract {
    logger: Logger;
    httpServer: Server;
    io: socket.Server;
}
