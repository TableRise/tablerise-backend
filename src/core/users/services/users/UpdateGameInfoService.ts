import HttpRequestErrors from 'src/infra/helpers/common/HttpRequestErrors';
import { HttpStatusCode } from 'src/infra/helpers/common/HttpStatusCode';
import { UpdateGameInfoServiceContract } from 'src/types/contracts/users/UpdateGameInfo';
import {
    UpdateGameInfoPayload,
    UpdateGameInfoProcessPayload,
} from 'src/types/requests/Payload';
import { UserGameInfoDoneResponse } from 'src/types/requests/Response';

export default class UpdateGameInfoService {
    private readonly _logger;
    private readonly _usersDetailsRepository;

    constructor({ usersDetailsRepository, logger }: UpdateGameInfoServiceContract) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this._addId = this._addId.bind(this);
        this._removeId = this._removeId.bind(this);
        this.update = this.update.bind(this);
    }

    private _addId({
        infoId,
        targetInfo,
        gameInfo,
    }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        this._logger('info', 'AddId - UpdateGameInfoService');
        
        const hasInfo =
            gameInfo[targetInfo].filter((data) => data === infoId).length > 0;

        hasInfo
            ? gameInfo[targetInfo].push(infoId)
            : new HttpRequestErrors({
                  message: `ID ${infoId} was already added to ${targetInfo}`,
                  code: HttpStatusCode.BAD_REQUEST,
                  name: 'Invalid Entry',
              });

        return gameInfo;
    }

    private _removeId({
        infoId,
        targetInfo,
        gameInfo,
    }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        this._logger('info', 'RemoveId - UpdateGameInfoService');
        const hasInfo = gameInfo[targetInfo].filter((data) => data !== infoId);

        gameInfo[targetInfo].length > hasInfo.length
            ? gameInfo[targetInfo].push(infoId)
            : new HttpRequestErrors({
                  message: `ID ${infoId} was never added to ${targetInfo}`,
                  code: HttpStatusCode.BAD_REQUEST,
                  name: 'Invalid Entry',
              });

        return gameInfo;
    }

    public async update({
        userId,
        infoId,
        targetInfo,
        operation,
    }: UpdateGameInfoPayload): Promise<string> {
        this._logger('info', 'Update - UpdateGameInfoService');
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        let gameInfo = userDetailInDb.gameInfo;

        if (operation === 'add')
            gameInfo = this._addId({ infoId, targetInfo, gameInfo });
        if (operation === 'remove')
            gameInfo = this._removeId({ infoId, targetInfo, gameInfo });

        userDetailInDb.gameInfo = gameInfo;

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb
        });

        return `ID ${infoId} ${operation} with success to ${targetInfo}`;
    }
}
