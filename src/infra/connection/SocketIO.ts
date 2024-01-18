import socket from 'socket.io';
import { Server } from 'http';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class SocketIO {
    private _socketInstance = {} as socket.Socket;
    private readonly _tables = {} as any;
    private readonly _logger;

    constructor({ logger }: InfraDependencies['socketIOContract']) {
        this._logger = logger;

        this.connect = this.connect.bind(this);
        this._joinTableSocketEvent = this._joinTableSocketEvent.bind(this);
    }

    public async connect(httpServer: Server): Promise<void> {
        this._logger('info', 'Connect - SocketIO', true);

        const io = new socket.Server(httpServer, {
            cors: {
                origin: '*',
                allowedHeaders: ['access_key'],
            },
        });

        io.on('connection', (socket) => {
            this._socketInstance = socket;
            socket.on('join', this._joinTableSocketEvent);
            socket.on(
                'changeBackground',
                async (table: string, newBackground: string): Promise<void> => {
                    this._tables[table as keyof typeof this._tables].imagens.push(
                        newBackground
                    );
                    io.to(this._tables).emit('backgroundChanged', newBackground);
                }
            );
            socket.on(
                'uploadImage',
                async (
                    table: string,
                    squareId: string,
                    imageData: string
                ): Promise<void> => {
                    this._tables[table as keyof typeof this._tables].objects.map(
                        (object: any) =>
                            object.elementID === parseInt(squareId)
                                ? { ...object, image: imageData }
                                : object
                    );
                    io.to(this._tables).emit('updateObjectImage', squareId, imageData);
                }
            );
            socket.on('disconnect', async (): Promise<void> => {
                this._logger('info', 'User disconnected', true);
            });
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
}
