import socket from 'socket.io';
import { Server } from 'http';
import {
    SocketMatches,
    SquareSize,
    addCharacterSocketEventPayload,
    joinMatchSocketEventPayload,
    changeMapImageSocketEventPayload,
    changeMusicSocketEventPayload,
    endMatchSocketEventPayload,
    setCharacterPictureSocketEventPayload,
    changeCharacterStatusSocketEventPayload,
    rollDiceSocketEventPayload,
    addLogSocketEventPayload,
    moveCharacterSocketEventPayload,
    deleteCharacterSocketEventPayload,
    disconnectCharacterSocketEvent,
} from 'src/types/modules/infra/connection/SocketIO';
import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import newUUID from 'src/domains/common/helpers/newUUID';
import characterStatusEnum from 'src/domains/campaigns/enums/avatarStatusEnum';
import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { CharacterInGame } from '@tablerise/database-management/dist/src/interfaces/Campaigns';
import { ImageObject } from '@tablerise/database-management/dist/src/interfaces/Common';

export default class SocketIO {
    private io = {} as socket.Server;
    private readonly matches: SocketMatches = {};
    private readonly campaignsRepository;
    private readonly logger;

    constructor({ campaignsRepository, logger }: InfraDependencies['socketIOContract']) {
        this.campaignsRepository = campaignsRepository;
        this.logger = logger;

        this.connect = this.connect.bind(this);
        this.joinMatchSocketEvent = this.joinMatchSocketEvent.bind(this);
        this.addCharacter = this.addCharacter.bind(this);
        this.createCharacter = this.createCharacter.bind(this);
        this.changeMapImageSocketEvent = this.changeMapImageSocketEvent.bind(this);
        this.changeMusicSocketEvent = this.changeMusicSocketEvent.bind(this);
        this.endMatchSocketEvent = this.endMatchSocketEvent.bind(this);
        this.disconnectSocketEvent = this.disconnectSocketEvent.bind(this);
        this.deleteCharacterSocketEvent = this.deleteCharacterSocketEvent.bind(this);
        this.moveCharacterSocketEvent = this.moveCharacterSocketEvent.bind(this);
        this.resizeCharacterSocketEvent = this.resizeCharacterSocketEvent.bind(this);
        this.addOrCreateCharacterSocketEvent = this.addOrCreateCharacterSocketEvent.bind(this);
        this.setCharacterPictureSocketEvent = this.setCharacterPictureSocketEvent.bind(this);
        this.changeCharacterStatusSocketEvent = this.changeCharacterStatusSocketEvent.bind(this);
        this.rollDiceSocketEvent = this.rollDiceSocketEvent.bind(this);
        this.addLogSocketEvent = this.addLogSocketEvent.bind(this);
    }

    public async connect(httpServer: Server): Promise<void> {
        this.logger('info', 'Connect - SocketIO', true);

        this.io = new socket.Server(httpServer, {
            cors: {
                origin: '*',
                allowedHeaders: ['access_key'],
            },
        });

        this.io.on('connection', (socket) => {
            socket.on('join', async (campaignId) => {
                await this.joinMatchSocketEvent({ campaignId, socket });
            });
            socket.on('create-character', this.addOrCreateCharacterSocketEvent);
            socket.on('change-map-image', this.changeMapImageSocketEvent);
            socket.on('change-music', this.changeMusicSocketEvent);
            socket.on('end-match', this.endMatchSocketEvent);
            socket.on('move-character', this.moveCharacterSocketEvent);
            socket.on('delete-character', this.deleteCharacterSocketEvent);
            socket.on('resize-character', this.resizeCharacterSocketEvent);
            socket.on('set-picture', this.setCharacterPictureSocketEvent);
            socket.on('change-status', this.changeCharacterStatusSocketEvent);
            socket.on('roll-dice', this.rollDiceSocketEvent);
            socket.on('add-log', this.addLogSocketEvent);
            socket.on('disconnect-socket', this.disconnectSocketEvent);
        });

        setInterval(async () => {
            for (const [, matchData] of Object.entries(this.matches)) {
                try {
                    const { campaignId, ...matchDataToSave } = matchData;
                    const campaign = await this.campaignsRepository.findOne({ campaignId });
                    campaign.matchData = matchDataToSave;
                    await this.campaignsRepository.update({ query: { campaignId }, payload: campaign });
                } catch (err) {
                    this.logger('error', `Periodic flush failed: ${String(err)}`, true);
                }
            }
        }, 30_000);
    }

    private async joinMatchSocketEvent({ campaignId, socket }: joinMatchSocketEventPayload): Promise<void> {
        const { matchData } = await this.campaignsRepository.findOne({
            campaignId,
        });

        if (!matchData) HttpRequestErrors.throwError('campaign-match-inexistent');

        await socket.join(matchData.matchId);
        this.matches[matchData.matchId] = { ...matchData, campaignId };
        socket.emit('joined-in-match', this.matches[matchData.matchId]);
    }

    private changeMapImageSocketEvent({ matchId, mapId }: changeMapImageSocketEventPayload): void {
        const mapToActual = this.matches[matchId].mapImages.find((map) => map.id === mapId);

        this.matches[matchId].actualMapImage = mapToActual ?? this.matches[matchId].actualMapImage;

        this.io.to(matchId).emit('match-background-changed', mapToActual);
    }

    private async addCharacter({
        characterId,
        campaignId,
    }: addCharacterSocketEventPayload): Promise<CharacterInGame | undefined> {
        const campaign = await this.campaignsRepository.findOne({
            campaignId,
        });

        if (!campaign.matchData) HttpRequestErrors.throwError('campaign-match-inexistent');

        return campaign.matchData.charactersInGame.find(
            (character: CharacterInGame) => character.characterId === characterId
        );
    }

    private async createCharacter({ userId, campaignId }: addCharacterSocketEventPayload): Promise<CharacterInGame> {
        const characterData: CharacterInGame = {
            characterId: newUUID(),
            userId,
            position: { x: 0, y: 0 },
            picture: null as unknown as ImageObject,
            size: { width: 200, height: 200 },
            status: characterStatusEnum.enum.ALIVE,
        };

        const campaign = await this.campaignsRepository.findOne({
            campaignId,
        });

        if (!campaign.matchData) HttpRequestErrors.throwError('campaign-match-inexistent');

        campaign.matchData.charactersInGame.push(characterData);

        await this.campaignsRepository.update({
            query: { campaignId },
            payload: campaign,
        });

        return characterData;
    }

    private async addOrCreateCharacterSocketEvent({
        matchId,
        userId,
        campaignId,
        characterId = null,
    }: addCharacterSocketEventPayload): Promise<void> {
        const characterData = characterId
            ? await this.addCharacter({ matchId, userId, campaignId, characterId })
            : await this.createCharacter({ matchId, userId, campaignId, characterId });

        if (!characterData) HttpRequestErrors.throwError('campaign-player-not-exists');

        this.matches[matchId].charactersInGame = this.matches[matchId].charactersInGame.length
            ? this.matches[matchId].charactersInGame
            : [];

        this.matches[matchId].charactersInGame.push(characterData);
        this.io.to(matchId).emit('character-added-to-the-match', characterData);
    }

    private moveCharacterSocketEvent({
        matchId,
        characterId,
        coordinates,
        socketId,
    }: moveCharacterSocketEventPayload): void {
        const characterIndex = this.matches[matchId].charactersInGame.findIndex(
            (character) => character.characterId === characterId
        );

        this.matches[matchId].charactersInGame[characterIndex].position.x = coordinates.x;
        this.matches[matchId].charactersInGame[characterIndex].position.y = coordinates.y;

        this.io.to(matchId).except(socketId).emit('Character Moved', coordinates.x, coordinates.y, characterId);
    }

    private deleteCharacterSocketEvent({ matchId, characterId }: deleteCharacterSocketEventPayload): void {
        const characters = this.matches[matchId].charactersInGame.filter(
            (character) => character.characterId !== characterId
        );
        this.matches[matchId].charactersInGame = characters;
        this.io.to(matchId).emit('box-deleted', characterId);
    }

    private async setCharacterPictureSocketEvent({
        matchId,
        characterId,
    }: setCharacterPictureSocketEventPayload): Promise<void> {
        const campaignId = this.matches[matchId].campaignId;
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const updatedCharacter = campaign.matchData?.charactersInGame.find(
            (c: CharacterInGame) => c.characterId === characterId
        );

        if (!updatedCharacter) HttpRequestErrors.throwError('campaign-player-not-exists');

        const characterIndex = this.matches[matchId].charactersInGame.findIndex((c) => c.characterId === characterId);
        if (characterIndex !== -1) {
            this.matches[matchId].charactersInGame[characterIndex].picture = updatedCharacter.picture;
        }

        this.io.to(matchId).emit('character-picture-updated', characterId, updatedCharacter.picture);
    }

    private resizeCharacterSocketEvent(matchId: string, characterId: string, size: SquareSize, socketId: string): void {
        const characterIndex = this.matches[matchId].charactersInGame.findIndex(
            (character) => character.characterId === characterId
        );

        this.matches[matchId].charactersInGame[characterIndex].size.width = size.width;
        this.matches[matchId].charactersInGame[characterIndex].size.height = size.height;

        this.io.to(matchId).except(socketId).emit('Box Resized', size, characterId);
    }

    private async disconnectSocketEvent({
        matchId,
        campaignId,
        userId,
    }: disconnectCharacterSocketEvent): Promise<void> {
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const { campaignId: _cid, ...matchDataToSave } = this.matches[matchId];
        campaign.matchData = matchDataToSave;
        await this.campaignsRepository.update({ query: { campaignId }, payload: campaign });
        this.io.to(matchId).emit('player-disconnected', userId);
    }

    private changeCharacterStatusSocketEvent({
        matchId,
        characterId,
        status,
    }: changeCharacterStatusSocketEventPayload): void {
        const characterIndex = this.matches[matchId].charactersInGame.findIndex((c) => c.characterId === characterId);

        if (characterIndex === -1) HttpRequestErrors.throwError('campaign-player-not-exists');

        this.matches[matchId].charactersInGame[characterIndex].status = status;
        this.io.to(matchId).emit('character-status-changed', characterId, status);
    }

    private rollDiceSocketEvent({ matchId, userId, notation, result }: rollDiceSocketEventPayload): void {
        const log = { loggedAt: new Date().toISOString(), content: `[${userId}] rolled ${notation} = ${result}` };
        this.matches[matchId].logs.push(log);
        this.io.to(matchId).emit('dice-rolled', { userId, notation, result });
    }

    private addLogSocketEvent({ matchId, content }: addLogSocketEventPayload): void {
        const log = { loggedAt: new Date().toISOString(), content };
        this.matches[matchId].logs.push(log);
        this.io.to(matchId).emit('log-added', log);
    }

    private changeMusicSocketEvent({ matchId, musicId }: changeMusicSocketEventPayload): void {
        const music = this.matches[matchId].musics.find((m) => m.id === musicId);
        this.io.to(matchId).emit('music-changed', music);
    }

    private async endMatchSocketEvent({ matchId, campaignId }: endMatchSocketEventPayload): Promise<void> {
        const campaign = await this.campaignsRepository.findOne({ campaignId });
        const { campaignId: _cid, ...matchDataToSave } = this.matches[matchId];
        campaign.matchData = matchDataToSave;
        campaign.matchData.characters = this.matches[matchId].charactersInGame;
        campaign.matchData.charactersInGame = [];
        await this.campaignsRepository.update({ query: { campaignId }, payload: campaign });
        this.io.to(matchId).emit('match-ended');
        Reflect.deleteProperty(this.matches, matchId);
    }
}
