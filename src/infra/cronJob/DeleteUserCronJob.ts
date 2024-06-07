import cron from 'node-cron';
import daysDifference from 'src/domains/common/helpers/daysDifference';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import InfraDependencies from "src/types/modules/infra/InfraDependencies";

const DATE_LIMIT = 15;


export default class DeleteUserCronJob {
    private readonly _logger;
    private readonly _usersRepository;
    private _usersDeleteList;

    constructor({logger, usersRepository, usersDeleteList }: InfraDependencies['deleteUserCronJobContract']){
        this._logger = logger;
        this._usersRepository = usersRepository;
        this._usersDeleteList = usersDeleteList;
    }

    public async deleteUserRoutine() : Promise<void> {
        cron.schedule(`1 0 * * *`, async () => {
            const deletedUsers = this._usersDeleteList.map(async (user : UserInstance) => {
                const { userId, updatedAt } = user;
                

                const fromExclusionDate = Date.parse(updatedAt);

                if(daysDifference(fromExclusionDate) >= DATE_LIMIT){
                    await this._usersRepository.delete({ userId });
                    return user;
                }
            })
            this._usersDeleteList = this._usersDeleteList.filter(
                ({ userId } : UserInstance) => !deletedUsers.includes(userId)
            );
        });
        
      }
}