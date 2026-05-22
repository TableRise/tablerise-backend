import HttpRequestErrors from 'src/domains/common/helpers/HttpRequestErrors';
import { syncRankByBadgesLength } from 'src/domains/users/helpers/BadgeAwardHandler';
import UserCoreDependencies from 'src/types/modules/core/users/UserCoreDependencies';
import { AddGameInfoPayload, RemoveGameInfoPayload } from 'src/types/api/users/http/payload';
import { UpdateGameInfoProcessPayload, UserGameInfoDoneResponse } from 'src/types/api/users/methods';

export default class UpdateGameInfoService {
    private readonly logger;
    private readonly usersDetailsRepository;

    constructor({ usersDetailsRepository, logger }: UserCoreDependencies['updateGameInfoServiceContract']) {
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;

        this.add = this.add.bind(this);
        this.remove = this.remove.bind(this);
    }

    private addId({ infoId, targetInfo, data, gameInfo }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        const callName = `[${this.constructor.name}] - ${this.addId.name}`;
        this.logger('info', callName);

        const dataLength = Object.keys(data).length;
        const filterProp = `${targetInfo.slice(0, targetInfo.length - 2)}Id`;
        const hasInfo =
            dataLength > 0
                ? gameInfo[targetInfo].some((currentData) => currentData[filterProp] === data[filterProp])
                : gameInfo[targetInfo].some((currentData) => currentData === infoId);

        hasInfo
            ? HttpRequestErrors.throwError('info-already-added')
            : dataLength > 0
            ? gameInfo[targetInfo].push(data)
            : gameInfo[targetInfo].push(infoId);

        return gameInfo;
    }

    private removeId({
        infoId,
        targetInfo,
        data: dataToRemove,
        gameInfo,
    }: UpdateGameInfoProcessPayload): UserGameInfoDoneResponse {
        this.logger('info', 'RemoveId - UpdateGameInfoService');
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

    public async add({ userId, infoId, data, targetInfo }: AddGameInfoPayload): Promise<string> {
        const callName = `[${this.constructor.name}] - ${this.add.name}`;
        this.logger('info', callName);
        const userDetailInDb = await this.usersDetailsRepository.findOne({ userId });

        userDetailInDb.gameInfo = this.addId({ infoId, targetInfo, gameInfo: userDetailInDb.gameInfo, data });
        if (targetInfo === 'badges') syncRankByBadgesLength(userDetailInDb);

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });

        return `ID ${infoId} add with success to ${targetInfo}`;
    }

    public async remove({ userId, infoId, data, targetInfo }: RemoveGameInfoPayload): Promise<string> {
        const callName = `[${this.constructor.name}] - ${this.remove.name}`;
        this.logger('info', callName);
        const userDetailInDb = await this.usersDetailsRepository.findOne({ userId });

        userDetailInDb.gameInfo = this.removeId({ infoId, targetInfo, gameInfo: userDetailInDb.gameInfo, data });

        await this.usersDetailsRepository.update({
            query: { userDetailId: userDetailInDb.userDetailId },
            payload: userDetailInDb,
        });

        return `ID ${infoId} remove with success to ${targetInfo}`;
    }
}
