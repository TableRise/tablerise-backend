import socket from 'socket.io';
import { Server } from 'http';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class SocketIO {
    private readonly _logger;

    constructor({ logger }: InfraDependencies['socketIOContract']) {
        this._logger = logger;
    }

    public async connect(httpServer: Server): Promise<void> {
        this._logger('info', 'Connect - SocketIO', true);

        const tables = {};

        const io = new socket.Server(httpServer, {
            cors: {
                origin: '*',
                allowedHeaders: ['access_key']
            }
        });

        io.on('connection', (socket) => {
            socket.on('join', async (table) => {
                await socket.join(table);
                const tableData = tables[table as keyof typeof tables] || { objects: [], images: [] };
                // @ts-expect-error Will have
                socket.emit('Joined at TableRise', tableData.objects, tableData.images);
            });
        });
    }
}
