import socket from 'socket.io';
import { Server } from 'http';
import { Coordinates, SquareSize } from 'src/types/modules/infra/connection/SocketIO';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import newUUID from 'src/domains/common/helpers/newUUID';

export default class SocketIO {
    private _socketInstance = {} as socket.Socket;
    private _io = {} as socket.Server;
    private readonly _rooms = {} as any;
    private readonly _logger;

    constructor({ logger }: InfraDependencies['socketIOContract']) {
        this._logger = logger;

        this.connect = this.connect.bind(this);
        this._createTableSocketEvent = this._createTableSocketEvent.bind(this);
        this._joinTableSocketEvent = this._joinTableSocketEvent.bind(this);
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
            this._socketInstance = socket;
            socket.on('create', this._createTableSocketEvent);
            socket.on('join', this._joinTableSocketEvent);
            socket.on('create box', this._createBox);
        });
    }

    private async _createTableSocketEvent(): Promise<void> {
        const roomId = newUUID();
        await this._socketInstance.join(roomId);
        const roomData = {
            objects: [],
            images: [],
        };

        this._rooms[roomId] = roomData;

        Object.keys(this._rooms).forEach((room: string) => {
            this._logger('info', room, true);
        });

        this._socketInstance.emit(
            'Created a room',
            roomData.objects,
            roomData.images,
            roomId
        );
    }

    private async _joinTableSocketEvent(roomId: string): Promise<void> {
        const roomExist = Object.keys(this._rooms).includes(roomId);
        if (!roomExist) {
            this._socketInstance.emit('Room not found', 'Sala não encontrada');
            return;
        }
        await this._socketInstance.join(roomId);
        const roomData = this._rooms[roomId as keyof typeof this._rooms];
        this._socketInstance.emit(
            'Joined a room',
            roomData.objects,
            roomData.images,
            roomId
        );
    }

    private _createBox(roomId: string, avatarName: string): void {
        this._logger('info', 'criando box', true);

        const avatarData = {
            avatarName,
            position: { x: 0, y: 0 },
        };
        this._rooms[roomId].objects.push(avatarData);
        this._io.to(roomId).emit('Created a box', avatarData);
    }

    private async _changeBackgroundSocketEvent(
        room: string,
        newBackground: string
    ): Promise<void> {
        this._rooms[room as keyof typeof this._rooms].imagens.push(newBackground);
        this._io.to(this._rooms).emit('backgroundChanged', newBackground);
    }

    private async _deleteSocketEvent(room: string, elementID: string): Promise<void> {
        this._rooms[room as keyof typeof this._rooms].objects.findIndex(
            (square: any) => square.elementID === parseInt(elementID)
        );
        this._io.to(this._rooms).emit('delete object', elementID);
    }

    private async _moveSocketEvent(
        room: string,
        coordinate: Coordinates,
        userID: string
    ): Promise<void> {
        this._io
            .to(this._rooms)
            .except(userID)
            .emit('any object move', coordinate.x, coordinate.y, coordinate.id);
    }

    private async _uploadImageSocketEvent(
        room: string,
        squareId: string,
        imageData: string
    ): Promise<void> {
        this._rooms[room as keyof typeof this._rooms].objects.map((object: any) =>
            object.elementID === parseInt(squareId)
                ? { ...object, image: imageData }
                : object
        );
        this._io.to(this._rooms).emit('updateObjectImage', squareId, imageData);
    }

    private async _resizeSocketEvent(
        room: string,
        size: SquareSize,
        userID: string
    ): Promise<void> {
        this._io.to(this._rooms).except(userID).emit('any Object Resizing', size);
    }

    private async _disconnectSocketEvent(): Promise<void> {
        this._logger('info', 'User disconnected', true);
    }
}
