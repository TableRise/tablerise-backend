import UUIDEnum from 'src/domains/user/enums/UUIDEnum';
import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { UpdateGameInfoOperationContract } from 'src/types/contracts/users/UpdateGameInfo';
import { UpdateGameInfoPayload } from 'src/types/requests/Payload';

export default class UpdateGameInfoOperation {
    private readonly _updateGameInfoService;
    private readonly _logger;

    constructor({ updateGameInfoService, logger }: UpdateGameInfoOperationContract) {
        this._updateGameInfoService = updateGameInfoService;
        this._logger = logger;
    }

    public async execute({ userId, newItemId, targetInfo, operation }: UpdateGameInfoPayload): Promise<string> {
        const isValidUUID = new RegExp(UUIDEnum.enum.isValid);

        if (!isValidUUID.test(newItemId))
            throw new HttpRequestErrors({
                message: 'The parameter newItemId is invalid',
                code: HttpStatusCode.BAD_REQUEST,
                name: 'Invalid Entry',
            });

        const gameInfoUpdated = await this._updateGameInfoService.update({ userId, newItemId, targetInfo, operation });
        return gameInfoUpdated;
    }
}
