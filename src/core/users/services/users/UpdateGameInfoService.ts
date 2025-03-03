import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { UpdateGameInfoPayload } from 'src/types/api/users/http/payload';
import {
    UpdateGameInfoProcessPayload,
    UserGameInfoDoneResponse,
} from 'src/types/api/users/methods';

export default class UpdateGameInfoService {
    private readonly _logger;
    private readonly _usersDetailsRepository;

    constructor({
        usersDetailsRepository,
        logger,
    }: UserCoreDependencies['updateGameInfoServiceContract']) {
        this._usersDetailsRepository = usersDetailsRepository;
        this._logger = logger;

        this._addId = this._addId.bind(this);
        this._removeId = this._removeId.bind(this);
        this.update = this.update.bind(this);
    }

    private _addId({
        infoId,
        targetInfo,
        data,
        gameInfo,
    }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        this._logger('info', 'AddId - UpdateGameInfoService');

        const hasInfo = gameInfo[targetInfo].some((data) => data === infoId);
        const dataLength = Object.keys(data).length;

        hasInfo
            ? HttpRequestErrors.throwError('info-already-added')
            : dataLength > 0 ? gameInfo[targetInfo].push(data) : gameInfo[targetInfo].push(infoId);

        return gameInfo;
    }

    private _removeId({
        infoId,
        targetInfo,
        data: dataToRemove,
        gameInfo,
    }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        this._logger('info', 'RemoveId - UpdateGameInfoService');
        let hasInfo;
        const dataLength = Object.keys(dataToRemove).length;

        if (dataLength > 0) {
            const filterProp = `${targetInfo.slice(0, targetInfo.length - 2)}Id`;
            hasInfo = gameInfo[targetInfo].filter((data) => data[filterProp] !== dataToRemove[filterProp]);
            gameInfo[targetInfo] = hasInfo;

            return gameInfo;
        }

        hasInfo = gameInfo[targetInfo].filter((data) => data !== infoId);

        gameInfo[targetInfo] = hasInfo;

        return gameInfo;
    }

    public async update({
        userId,
        infoId,
        data,
        targetInfo,
        operation,
    }: UpdateGameInfoPayload): Promise<string> {
        this._logger('info', 'Update - UpdateGameInfoService');
        const userDetailInDb = await this._usersDetailsRepository.findOne({ userId });

        let gameInfo = userDetailInDb.gameInfo;

        if (operation === 'add') gameInfo = this._addId({ infoId, targetInfo, gameInfo, data });
        if (operation === 'remove')
            gameInfo = this._removeId({ infoId, targetInfo, gameInfo, data });

        userDetailInDb.gameInfo = gameInfo;

        await this._usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });

        return `ID ${infoId} ${operation} with success to ${targetInfo}`;
    }
}
