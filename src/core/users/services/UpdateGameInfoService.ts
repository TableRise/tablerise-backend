import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { UpdateGameInfoServiceContract } from 'src/types/contracts/users/UpdateGameInfo';
import { UpdateGameInfoPayload, UpdateGameInfoProcessPayload } from 'src/types/requests/Payload';
import { UserGameInfoDoneResponse } from 'src/types/requests/Response';

export default class UpdateGameInfoService {
    private readonly _logger;
    private readonly _userDetailsRepository;

    constructor({ userDetailsRepository, logger }: UpdateGameInfoServiceContract) {
        this._userDetailsRepository = userDetailsRepository;
        this._logger = logger;

        this._addId = this._addId.bind(this);
        this._removeId = this._removeId.bind(this);
        this.update = this.update.bind(this);
    }

    private _addId({ newItemId, targetInfo, gameInfo }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        const hasInfo = gameInfo[targetInfo].filter((data) => data === newItemId).length > 0;

        hasInfo
            ? gameInfo[targetInfo].push(newItemId)
            : new HttpRequestErrors({
                  message: `ID ${newItemId} was already added to ${targetInfo}`,
                  code: HttpStatusCode.BAD_REQUEST,
                  name: 'Invalid Entry',
              });

        return gameInfo;
    }

    private _removeId({ newItemId, targetInfo, gameInfo }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        const hasInfo = gameInfo[targetInfo].filter((data) => data !== newItemId);

        gameInfo[targetInfo].length > hasInfo.length
            ? gameInfo[targetInfo].push(newItemId)
            : new HttpRequestErrors({
                  message: `ID ${newItemId} was never added to ${targetInfo}`,
                  code: HttpStatusCode.BAD_REQUEST,
                  name: 'Invalid Entry',
              });

        return gameInfo;
    }

    public async update({ userId, newItemId, targetInfo, operation }: UpdateGameInfoPayload): Promise<string> {
        const [userDetailInDb] = await this._userDetailsRepository.find({ userId });

        let gameInfo = userDetailInDb.gameInfo;

        if (operation === 'add') gameInfo = this._addId({ newItemId, targetInfo, gameInfo });
        if (operation === 'remove') gameInfo = this._removeId({ newItemId, targetInfo, gameInfo });

        userDetailInDb.gameInfo = gameInfo;

        await this._userDetailsRepository.update({ id: userId, payload: userDetailInDb });

        return `ID ${newItemId} ${operation} with success to ${targetInfo}`;
    }
}
