import socket from 'socket.io';
import { Server } from 'http';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import { SocketRooms } from 'src/types/modules/infra/connection/SocketIO';

export default class SocketIO {
    private _socketInstance = {} as socket.Socket;
    private _io = {} as socket.Server;
    private readonly _rooms = {} as SocketRooms;
    private readonly _logger;

    constructor({ logger }: InfraDependencies['socketIOContract']) {
        this._logger = logger;

        this.connect = this.connect.bind(this);
        this._joinRoomSocketEvent = this._joinRoomSocketEvent.bind(this);
        this._changeBackgroundSocketEvent = this._changeBackgroundSocketEvent.bind(this);
        this._uploadImageSocketEvent = this._uploadImageSocketEvent.bind(this);
        this._disconnectSocketEvent = this._disconnectSocketEvent.bind(this);
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
            socket.on('join', this._joinRoomSocketEvent);
        });
    }

    private async _joinRoomSocketEvent(tableId: string): Promise<void> {
        await this._socketInstance.join(tableId);

        const roomData = this._rooms[tableId] || {
            objects: [],
            images: [],
        };

        this._socketInstance.emit(
            'Joined at TableRise',
            roomData.objects,
            roomData.images
        );
    }

    private async _changeBackgroundSocketEvent(
        tableId: string,
        newBackground: string
    ): Promise<void> {
        this._rooms[tableId].images.push(newBackground);
        // Verificar linha abaixo com Isac, original: this._io.to(this._rooms).emit('backgroundChanged', newBackground);
        this._io.to(this._rooms[tableId].images).emit('backgroundChanged', newBackground);
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
        this._io.to(this._rooms[tableId].images).emit('updateObjectImage', squareId, imageData);
    }

    private async _disconnectSocketEvent(): Promise<void> {
        this._logger('info', 'User disconnected', true);
    }
}
