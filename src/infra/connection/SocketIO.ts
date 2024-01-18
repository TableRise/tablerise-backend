import socket from 'socket.io';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class SocketIO {
    private _socketInstance = {} as socket.Socket;
    private readonly _tables = {} as any;
    private readonly _io = {} as socket.Server;
    private readonly _logger;

    constructor({ logger, httpServer }: InfraDependencies['socketIOContract']) {
        this._logger = logger;
        this._io = new socket.Server(httpServer, {
            cors: {
                origin: '*',
                allowedHeaders: ['access_key'],
            },
        });

        this.connect = this.connect.bind(this);
        this._joinTableSocketEvent = this._joinTableSocketEvent.bind(this);
        this._changeBackgroundSocketEvent = this._changeBackgroundSocketEvent.bind(this);
        this._uploadImageSocketEvent = this._uploadImageSocketEvent.bind(this);
        this._disconnectSocketEvent = this._disconnectSocketEvent.bind(this);
    }

    public async connect(): Promise<void> {
        this._logger('info', 'Connect - SocketIO', true);

        this._io.on('connection', (socket) => {
            this._socketInstance = socket;
            socket.on('join', this._joinTableSocketEvent);
            socket.on('changeBackground', this._changeBackgroundSocketEvent);
            socket.on('uploadImage', this._uploadImageSocketEvent);
            socket.on('disconnect', this._disconnectSocketEvent);
        });
    }
    // Remove this comment.

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

    private async _changeBackgroundSocketEvent(
        table: string,
        newBackground: string
    ): Promise<void> {
        this._tables[table as keyof typeof this._tables].imagens.push(newBackground);
        this._io.to(this._tables).emit('backgroundChanged', newBackground);
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

    private async _disconnectSocketEvent(): Promise<void> {
        this._logger('info', 'User disconnected', true);
    }
}
