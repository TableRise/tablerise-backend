import socket from 'socket.io';
import { Server } from 'http';
import {
    SocketRooms,
    Coordinates,
    SquareSize,
} from 'src/types/modules/infra/connection/SocketIO';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import newUUID from 'src/domains/common/helpers/newUUID';

export default class SocketIO {
    private _io = {} as socket.Server;
    private readonly _rooms: SocketRooms = {};
    private readonly _logger;

    constructor({ logger }: InfraDependencies['socketIOContract']) {
        this._logger = logger;

        this.connect = this.connect.bind(this);
        this._joinRoomSocketEvent = this._joinRoomSocketEvent.bind(this);
        this._createBox = this._createBox.bind(this);
        this._changeBackgroundSocketEvent = this._changeBackgroundSocketEvent.bind(this);
        this._uploadImageSocketEvent = this._uploadImageSocketEvent.bind(this);
        this._disconnectSocketEvent = this._disconnectSocketEvent.bind(this);
        this._deleteSocketEvent = this._deleteSocketEvent.bind(this);
        this._moveSocketEvent = this._moveSocketEvent.bind(this);
        this._resizeSocketEvent = this._resizeSocketEvent.bind(this);
    }

    public async connect(httpServer: Server): Promise<void> {
        this._logger('info', 'Connect - SocketIO', true);

        this._io = new socket.Server(httpServer, {
            cors: {
                origin: '*',
                allowedHeaders: ['access_key'],
            },
        });

        this._io.on('connection', (socket) => {
            socket.on('join', async (roomId: string = newUUID()) => { await this._joinRoomSocketEvent(roomId, socket) });
            socket.on('create-box', this._createBox);
            socket.on('background', this._changeBackgroundSocketEvent);
            socket.on('move-box', this._moveSocketEvent);
            socket.on('delete-box', this._deleteSocketEvent);
            socket.on('set-avatar-image', this._uploadImageSocketEvent);
            socket.on('resize-box', this._resizeSocketEvent);
            socket.on('disconnect-socket', this._disconnectSocketEvent);
        });
    }

    private async _joinRoomSocketEvent(roomId: string = newUUID(), socket: socket.Socket): Promise<void> {
        await socket.join(roomId);
        const roomData = this._rooms[roomId] || {
            objects: [],
            images: [],
            roomId,
        };

        this._rooms[roomId] = roomData;

        socket.emit('Joined a room', this._rooms[roomId]);
    }

    private async _changeBackgroundSocketEvent(
        roomId: string,
        newBackground: string
    ): Promise<void> {
        this._rooms[roomId].images.push(newBackground);
        // Verificar linha abaixo com Isac, original: this._io.to(this._rooms).emit('backgroundChanged', newBackground);
        this._io.to(this._rooms[roomId].images).emit('backgroundChanged', newBackground);
    }

    private _createBox(roomId: string, avatarName: string): void {
        const avatarData = {
            avatarName,
            position: { x: 0, y: 0 },
        };

        this._rooms[roomId].objects.push(avatarData);

        this._io.to(roomId).emit('Created a box', avatarData);
    }

    private async _moveSocketEvent(
        roomId: string,
        coordinate: Coordinates,
        userID: string
    ): Promise<void> {
        this._io
            // Verificar linha abaixo com Isac, original: .to(this._rooms)
            .to(this._rooms[roomId].images)
            .except(userID)
            .emit('any object move', coordinate.x, coordinate.y, coordinate.id);
    }

    private async _deleteSocketEvent(roomId: string, elementID: string): Promise<void> {
        this._rooms[roomId].objects.findIndex(
            (square: any) => square.elementID === parseInt(elementID)
        );
        // Verificar linha abaixo com Isac, original: this._io.to(this._rooms).emit('delete object', elementID);
        this._io.to(this._rooms[roomId].images).emit('delete object', elementID);
    }

    private async _uploadImageSocketEvent(
        tableId: string,
        squareId: string,
        imageData: string
    ): Promise<void> {
        this._rooms[tableId].objects.map((object: any) =>
            object.elementID === parseInt(squareId)
                ? { ...object, image: imageData }
                : object
        );
        // Verificar linha abaixo com Isac, original: this._io.to(this._rooms).emit('updateObjectImage', squareId, imageData);
        this._io
            .to(this._rooms[tableId].images)
            .emit('updateObjectImage', squareId, imageData);
    }

    private async _resizeSocketEvent(
        roomId: string,
        size: SquareSize,
        userID: string
    ): Promise<void> {
        // Verificar linha abaixo com Isac, original: this._io.to(this._rooms).except(userID).emit('any Object Resizing', size);
        this._io
            .to(this._rooms[roomId].images)
            .except(userID)
            .emit('any Object Resizing', size);
    }

    private async _disconnectSocketEvent(): Promise<void> {
        this._logger('info', 'User disconnected', true);
    }
}
