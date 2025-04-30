import socket from 'socket.io';
import { Server } from 'http';
import {
    SocketMatches,
    SquareSize,
    addAvatarSocketEventPayload,
    joinMatchSocketEventPayload,
    changeMapImageSocketEventPayload,
    moveAvatarSocketEventPayload,
    deleteAvatarSocketEventPayload,
    disconnectAvatarSocketEvent,
} from 'src/types/modules/infra/connection/SocketIO';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import newUUID from 'src/domains/common/helpers/newUUID';
import avatarStatusEnum from 'src/domains/campaigns/enums/avatarStatusEnum';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { Avatar } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

export default class SocketIO {
    private _io = {} as socket.Server;
    private readonly _matches: SocketMatches = {};
    private readonly _campaignsRepository;
    private readonly _logger;
    private readonly _connectedUsers: Record<string, { userId: string; matchId: string, campaignId: string }> = {};

    constructor({ campaignsRepository, logger }: InfraDependencies['socketIOContract']) {
        this._campaignsRepository = campaignsRepository;
        this._logger = logger;

        this.connect = this.connect.bind(this);
        this._joinMatchSocketEvent = this._joinMatchSocketEvent.bind(this);
        this._addAvatar = this._addAvatar.bind(this);
        this._createAvatar = this._createAvatar.bind(this);
        this._changeMapImageSocketEvent = this._changeMapImageSocketEvent.bind(this);
        this._addAvatarPictureSocketEvent = this._addAvatarPictureSocketEvent.bind(this);
        this._disconnectSocketEvent = this._disconnectSocketEvent.bind(this);
        this._deleteAvatarSocketEvent = this._deleteAvatarSocketEvent.bind(this);
        this._moveAvatarSocketEvent = this._moveAvatarSocketEvent.bind(this);
        this._resizeAvatarSocketEvent = this._resizeAvatarSocketEvent.bind(this);
        this._addOrCreateAvatarSocketEvent =
            this._addOrCreateAvatarSocketEvent.bind(this);
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
            console.log('Novo usuário conectado');

            // configuração para saber quantas pessoa existem na sala
            this._connectedUsers[socket.id] = {
                userId: '', // Será preenchido no evento 'join'
                matchId: '',
                campaignId: ''
            };
            socket.on('join', async (campaignId, userId) => {
                await this._joinMatchSocketEvent({ campaignId, socket, userId});
            });
            socket.on('create-avatar', this._addOrCreateAvatarSocketEvent);
            socket.on('change-map-image', this._changeMapImageSocketEvent);
            socket.on('move-avatar', this._moveAvatarSocketEvent);
            socket.on('delete-avatar', this._deleteAvatarSocketEvent);
            socket.on('set-picture', this._addAvatarPictureSocketEvent);
            socket.on('resize-avatar', this._resizeAvatarSocketEvent);
            // parte mais importante do código!!!
            // é preciso usar o nome do evento padrão do socket 'disconnect' esse evento é o evento padrão pra quando um jogardor 
            // sai da tela por QUALQUER motivo seja fechando a aba seja pq ficou sem internet
            socket.on('disconnect', async () => {
                console.log('usuário desconectado')
                await this._handleDisconnect(socket.id);
            });
            // socket.on('disconnect', this._disconnectSocketEvent);
        });
    }

    private async _joinMatchSocketEvent({
        campaignId,
        socket,
        userId
    }: joinMatchSocketEventPayload): Promise<void> {
        const { matchData } = await this._campaignsRepository.findOne({
            campaignId,
        });

        if (!matchData) HttpRequestErrors.throwError('campaign-match-inexistent');

        await socket.join(matchData.matchId);

        // criar informações baseada no socket.id
        this._connectedUsers[socket.id].userId = userId;
        this._connectedUsers[socket.id].matchId = matchData.matchId;
        this._connectedUsers[socket.id].campaignId = campaignId;
        
        // caso essa partida n esteja em andamento, pega as informações no BD
        this._matches[matchData.matchId] ?? (this._matches[matchData.matchId] = matchData);
        console.log('this._matches[matchData.matchId] a ser enviado', this._matches[matchData.matchId])

        // precisa criar um playersInGame diretamente no BD pra n quebrar isso que eu fiz é uma gambia
        this._matches[matchData.matchId].playersInGame ? 
            this._matches[matchData.matchId].playersInGame.push(userId) : 
            this._matches[matchData.matchId].playersInGame = []


        console.log('this._matches[matchId].playersInGame.length ao entrar', this._matches[matchData.matchId].playersInGame.length)
        
        socket.emit('joined-in-match', this._matches[matchData.matchId]);
    }

    private _changeMapImageSocketEvent({
        matchId,
        mapId,
    }: changeMapImageSocketEventPayload): void {
        
        console.log('changeMapImageSocketEvent')
        const mapToActual = this._matches[matchId].mapImages.find(
            (map) => map.id === mapId
        );

        this._matches[matchId].actualMapImage =
            mapToActual ?? this._matches[matchId].actualMapImage;

        this._io.to(matchId).emit('match-background-changed', mapToActual);
    }

    private async _addAvatar({
        avatarId,
        campaignId,
    }: addAvatarSocketEventPayload): Promise<Avatar | undefined> {
        const campaign = await this._campaignsRepository.findOne({
            campaign_id: campaignId,
        });

        if (!campaign.matchData)
            HttpRequestErrors.throwError('campaign-match-inexistent');

        return campaign.matchData.avatars.find(
            (avatar: Avatar) => avatar.avatarId === avatarId
        );
    }

    private async _createAvatar({
        userId,
        campaignId,
    }: addAvatarSocketEventPayload): Promise<Avatar> {
        const avatarData: Avatar = {
            avatarId: newUUID(),
            userId,
            picture: {} as ImageObject,
            position: { x: 0, y: 0 },
            size: { width: 200, height: 200 },
            status: avatarStatusEnum.enum.ALIVE,
        };


        // **** isso aqui pode sair, visto que um novo método de validação deve ser feito
        // const campaign = await this._campaignsRepository.findOne({
        //     campaignId,
        // });

        // if (!campaign.matchData)
        //     HttpRequestErrors.throwError('campaign-match-inexistent');

        // campaign.matchData.avatars.push(avatarData);

        // await this._campaignsRepository.update({
        //     query: { campaignId },
        //     payload: campaign,
        // });

        return avatarData;
    }

    private async _addOrCreateAvatarSocketEvent({
        matchId,
        userId,
        campaignId,
        avatarId = null,
    }: addAvatarSocketEventPayload): Promise<void> {
        console.log('addOrCreateAvatarSocketEvent escutado');


        // isso será ajustando, pq devido a novas regras, não existe como um avatar ser adicionado sem ser criado
        const avatarData = avatarId
            ? await this._addAvatar({ matchId, userId, campaignId, avatarId }) //n sei pra que server isso
            : await this._createAvatar({ matchId, userId, campaignId, avatarId }); //esse será o caminho padrão 


            // n vejo sentido nisso
        // this._matches[matchId].avatarsInGame = this._matches[matchId].avatarsInGame.length
        //     ? this._matches[matchId].avatarsInGame
        //     : [];

        this._matches[matchId].avatars.push(avatarData as Avatar);
        this._io.to(matchId).emit('avatar-added-to-the-match', avatarData);
    }

    private _moveAvatarSocketEvent({
        matchId,
        avatarId,
        coordinates,
        userId,
        socketId
    }: moveAvatarSocketEventPayload): void {
        console.log('moveAvatarSocketEvent')
        const avatarIndex = this._matches[matchId].avatars.findIndex(
            (avatar) => avatar.avatarId === avatarId
        );

        this._matches[matchId].avatars[avatarIndex].position.x = coordinates.x;
        this._matches[matchId].avatars[avatarIndex].position.y = coordinates.y;

        this._io
            .to(matchId)
            .except(socketId)
            .emit('Avatar Moved', coordinates.x, coordinates.y, avatarId);
    }

    private _deleteAvatarSocketEvent({
        matchId,
        avatarId,
    }: deleteAvatarSocketEventPayload): void {

        const avatars = this._matches[matchId].avatars.filter(
            (avatar) => avatar.avatarId !== avatarId
        );
        this._matches[matchId].avatars = avatars;
        this._io.to(matchId).emit('box-deleted', avatarId);
    }

    private _addAvatarPictureSocketEvent(
        matchId: string,
        avatarId: string,
        imageLink: string
    ): void {
        const avatarIndex = this._matches[matchId].avatars.findIndex(
            (avatar) => avatar.avatarId === avatarId
        );
        this._matches[matchId].avatars[avatarIndex].picture = {
            id: '',
            title: '',
            link: imageLink,
            uploadDate: new Date().toISOString(),
            deleteUrl: '',
            request: { success: true, status: 200 },
        };

        this._io.to(matchId).emit('avatar-picture-uploaded', avatarId, imageLink);
    }

    private _resizeAvatarSocketEvent(
        matchId: string,
        avatarId: string,
        size: SquareSize,
        socketId: string
    ): void {
        const avatarIndex = this._matches[matchId].avatars.findIndex(
            (avatar) => avatar.avatarId === avatarId
        );
        // aqui tá quebrando pq ao ajustar o tamanho do avatar ele salva o valor com numero + px ex:35px tem que ajustar isso depois
        this._matches[matchId].avatars[avatarIndex].size.width = size.width;
        this._matches[matchId].avatars[avatarIndex].size.height = size.height;

        this._io.to(matchId).except(socketId).emit('Box Resized', size, avatarId);
    }

    private async _disconnectSocketEvent(reason: string): Promise<void> {
        console.log('usuário desconectado')
        // console.log('reason', reason)
        // console.log('socket.id', socket.Server)
        // console.log('socket.id', socket)
        // console.log('socket.Socket', socket.Socket)
        // const actualMatch = this._matches[matchId];
        // actualMatch.avatars = actualMatch.avatarsInGame;

        // const { avatarsInGame, ...matchToSave } = actualMatch;

        // await this._campaignsRepository.update({
        //     query: { campaignId },
        //     payload: matchToSave,
        // });

        // this._io.to(matchId).emit('player-disconnected', userId);
    }

    private async _handleDisconnect(socketId: string): Promise<void> {
        // pega as informações do usuário 
        const userInfo = this._connectedUsers[socketId];


        if (userInfo) {
            const { userId, matchId, campaignId } = userInfo;
            console.log(`Usuário ${userId} desconectou da sala ${matchId}`);

            // retira o player da lista de jogadores no jogo (para saber quantos jogadores tem online)
            // obs, atualmente isso quebra quando vc entra na janela  /matchs e fecha ela sem antes entrar em uma partida, isso vai ser corrigido
            this._matches[matchId].playersInGame = this._matches[matchId].playersInGame
                .filter(playerId => playerId !== userId);

            // isso tá bugado pq eu mockei que todos os player tem o mesmo id, ou seja, quando a primeira pessoa sair do jogo
            // esse contador vai pra zero 
            console.log(`this._matches[matchId].playersInGame.length`, this._matches[matchId].playersInGame.length)
            if(this._matches[matchId].playersInGame.length === 0){

                const campaign = await this._campaignsRepository.findOne({
                    campaignId,
                });

                if (!campaign.matchData)
                    HttpRequestErrors.throwError('campaign-match-inexistent');

                campaign.matchData = this._matches[matchId];
                console.log('campaign.matchData', campaign.matchData)
                await this._campaignsRepository.update({
                    query: { campaignId },
                    payload: campaign,
                 });
            }
                
            // Notifica os outros usuários
            // essa feature pode ser feita depois
            // if (matchId) {
            //     this._io.to(matchId).emit('user-disconnected', userId);
            // }
            
            // Limpa o registro
            delete this._connectedUsers[socketId];
        }
    }
}
