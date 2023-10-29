import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { UpdateGameInfoOperationContract } from 'src/types/users/contracts/core/UpdateGameInfo';
import { UpdateGameInfoPayload } from 'src/types/users/requests/Payload';

export default class UpdateGameInfoOperation {
    private readonly _updateGameInfoService;
    private readonly _logger;

    constructor({ updateGameInfoService, logger }: UpdateGameInfoOperationContract) {
        this._updateGameInfoService = updateGameInfoService;
        this._logger = logger;

        this.execute = this.execute.bind(this);
    }

    public async execute({
        userId,
        infoId,
        targetInfo,
        operation,
    }: UpdateGameInfoPayload): Promise<string> {
        this._logger('info', 'Execute - UpdateGameInfoOperation');
        const isValidUUID = /^[0-9A-F]{8}-[0-9A-F]{4}-[4][0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;

        if (!isValidUUID.test(infoId))
            throw new HttpRequestErrors({
                message: 'The parameter infoId is invalid',
                code: HttpStatusCode.BAD_REQUEST,
                name: 'Invalid Entry',
            });

        const gameInfoUpdated = await this._updateGameInfoService.update({
            userId,
            infoId,
            targetInfo,
            operation,
        });
        return gameInfoUpdated;
    }
}
