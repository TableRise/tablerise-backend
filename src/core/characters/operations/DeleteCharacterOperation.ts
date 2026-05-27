import { DeleteCharacterPayload } from 'src/types/api/characters/http/payload';
import CharacterCoreDependencies from 'src/types/modules/core/characters/CharacterCoreDependencies';

export default class DeleteCharacterOperation {
    private readonly deleteCharacterService;
    private readonly socketIO;
    private readonly logger;

    constructor({
        deleteCharacterService,
        socketIO,
        logger,
    }: CharacterCoreDependencies['deleteCharacterOperationContract']) {
        this.deleteCharacterService = deleteCharacterService;
        this.socketIO = socketIO;
        this.logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute(payload: DeleteCharacterPayload): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.execute.name}`;
        this.logger('info', callName);

        const savedCampaign = await this.deleteCharacterService.delete(payload);

        if (savedCampaign) {
            this.socketIO.syncActiveCampaign(savedCampaign);
        }
    }
}
