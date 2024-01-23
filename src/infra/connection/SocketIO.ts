import socket from 'socket.io';
import { Server } from 'http';
import { Coordinates, SquareSize } from 'src/types/modules/infra/connection/SocketIO';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class SocketIO {
    private _socketInstance = {} as socket.Socket;
    private _io = {} as socket.Server;
    private readonly _tables = {} as any;
    private readonly _logger;

    constructor({ logger }: InfraDependencies['socketIOContract']) {
        this._logger = logger;

        this.connect = this.connect.bind(this);
        this._joinTableSocketEvent = this._joinTableSocketEvent.bind(this);
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
            socket.on('join', this._joinTableSocketEvent);
        });
    }

    private async _changeBackgroundSocketEvent(
        table: string,
        newBackground: string
    ): Promise<void> {
        this._tables[table as keyof typeof this._tables].imagens.push(newBackground);
        this._io.to(this._tables).emit('backgroundChanged', newBackground);
    }

    private async _deleteSocketEvent(table: string, elementID: string): Promise<void> {
        this._tables[table as keyof typeof this._tables].objects.findIndex(
            (square: any) => square.elementID === parseInt(elementID)
        );
        this._io.to(this._tables).emit('delete object', elementID);
    }

    private async _joinTableSocketEvent(table: string): Promise<void> {
        await this._socketInstance.join(table);
        const tableData = this._tables[table as keyof typeof this._tables] || {
            objects: [],
            images: [],
        };
        this._socketInstance.emit(
            'Joined at TableRise',
            tableData.objects,
            tableData.images
        );
    }

    private async _moveSocketEvent(
        table: string,
        coordinate: Coordinates,
        userID: string
    ): Promise<void> {
        this._io
            .to(this._tables)
            .except(userID)
            .emit('any object move', coordinate.x, coordinate.y, coordinate.id);
    }

    private async _uploadImageSocketEvent(
        table: string,
        squareId: string,
        imageData: string
    ): Promise<void> {
        this._tables[table as keyof typeof this._tables].objects.map((object: any) =>
            object.elementID === parseInt(squareId)
                ? { ...object, image: imageData }
                : object
        );
        this._io.to(this._tables).emit('updateObjectImage', squareId, imageData);
    }

    private async _resizeSocketEvent(
        table: string,
        size: SquareSize,
        userID: string
    ): Promise<void> {
        this._io.to(this._tables).except(userID).emit('any Object Resizing', size);
    }

    private async _disconnectSocketEvent(): Promise<void> {
        this._logger('info', 'User disconnected', true);
    }
}
