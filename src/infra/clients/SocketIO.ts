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
            socket.on('join', async (campaignId) => {
                await this._joinMatchSocketEvent({ campaignId, socket });
            });
            socket.on('create-avatar', this._addOrCreateAvatarSocketEvent);
            socket.on('change-map-image', this._changeMapImageSocketEvent);
            socket.on('move-avatar', this._moveAvatarSocketEvent);
            socket.on('delete-avatar', this._deleteAvatarSocketEvent);
            socket.on('set-picture', this._addAvatarPictureSocketEvent);
            socket.on('resize-avatar', this._resizeAvatarSocketEvent);
            socket.on('disconnect-socket', this._disconnectSocketEvent);
        });
    }

    private async _joinMatchSocketEvent({
        campaignId,
        socket,
    }: joinMatchSocketEventPayload): Promise<void> {
        const { matchData } = await this._campaignsRepository.findOne({
            campaignId,
        });

        if (!matchData)
            HttpRequestErrors.throwError('campaign-match-inexistent');

        await socket.join(matchData.matchId);
        this._matches[matchData.matchId] = matchData;
        socket.emit('joined-in-match', this._matches[matchData.matchId]);
    }

    private _changeMapImageSocketEvent({
        matchId,
        mapId,
    }: changeMapImageSocketEventPayload): void {
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

        const campaign = await this._campaignsRepository.findOne({
            campaignId,
        });

        if (!campaign.matchData)
            HttpRequestErrors.throwError('campaign-match-inexistent');

        campaign.matchData.avatars.push(avatarData);

        await this._campaignsRepository.update({
            query: { campaignId },
            payload: campaign
        });

        return avatarData;
    }

    private async _addOrCreateAvatarSocketEvent({
        matchId,
        userId,
        campaignId,
        avatarId = null,
    }: addAvatarSocketEventPayload): Promise<void> {
        const avatarData = avatarId
            ? await this._addAvatar({ matchId, userId, campaignId, avatarId })
            : await this._createAvatar({ matchId, userId, campaignId, avatarId });

        this._matches[matchId].avatarsInGame = this._matches[matchId].avatarsInGame.length
            ? this._matches[matchId].avatarsInGame
            : [];

        this._matches[matchId].avatarsInGame.push(avatarData as Avatar);
        this._io.to(matchId).emit('avatar-added-to-the-match', avatarData);
    }

    private _moveAvatarSocketEvent({
        matchId,
        avatarId,
        coordinates,
        socketId,
    }: moveAvatarSocketEventPayload): void {
        const avatarIndex = this._matches[matchId].avatarsInGame.findIndex(
            (avatar) => avatar.avatarId === avatarId
        );

        this._matches[matchId].avatarsInGame[avatarIndex].position.x = coordinates.x;
        this._matches[matchId].avatarsInGame[avatarIndex].position.y = coordinates.y;

        this._io
            .to(matchId)
            .except(socketId)
            .emit('Avatar Moved', coordinates.x, coordinates.y, avatarId);
    }

    private _deleteAvatarSocketEvent({
        matchId,
        avatarId,
    }: deleteAvatarSocketEventPayload): void {
        const avatars = this._matches[matchId].avatarsInGame.filter(
            (avatar) => avatar.avatarId !== avatarId
        );
        this._matches[matchId].avatarsInGame = avatars;
        this._io.to(matchId).emit('box-deleted', avatarId);
    }

    private _addAvatarPictureSocketEvent(
        matchId: string,
        avatarId: string,
        imageLink: string
    ): void {
        const avatarIndex = this._matches[matchId].avatarsInGame.findIndex(
            (avatar) => avatar.avatarId === avatarId
        );

        this._matches[matchId].avatarsInGame[avatarIndex].picture = {
            id: '',
            title: '',
            link: imageLink,
            uploadDate: new Date().toISOString(),
            deleteUrl: '',
            request: { success: true, status: 200 }
        };

        this._io.to(matchId).emit('avatar-picture-uploaded', avatarId, imageLink);
    }

    private _resizeAvatarSocketEvent(
        matchId: string,
        avatarId: string,
        size: SquareSize,
        socketId: string
    ): void {
        const avatarIndex = this._matches[matchId].avatarsInGame.findIndex(
            (avatar) => avatar.avatarId === avatarId
        );

        this._matches[matchId].avatarsInGame[avatarIndex].size.width = size.width;
        this._matches[matchId].avatarsInGame[avatarIndex].size.height = size.height;

        this._io.to(matchId).except(socketId).emit('Box Resized', size, avatarId);
    }

    private async _disconnectSocketEvent({
        matchId,
        campaignId,
        userId,
    }: disconnectAvatarSocketEvent): Promise<void> {
        const actualMatch = this._matches[matchId];
        actualMatch.avatars = actualMatch.avatarsInGame as Avatar[];

        const { avatarsInGame, ...matchToSave } = actualMatch;

        await this._campaignsRepository.update({
            query: { campaignId },
            payload: matchToSave,
        });

        this._io.to(matchId).emit('player-disconnected', userId);
    }
}
