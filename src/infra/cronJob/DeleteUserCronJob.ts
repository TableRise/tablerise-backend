import cron from 'node-cron';
import daysDifference from 'src/domains/common/helpers/daysDifference';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import InfraDependencies from "src/types/modules/infra/InfraDependencies";

const WAIT_TO_EXCLUSION_PERIOD = 15;

export default class DeleteUserCronJob {
    private readonly _logger;
    private readonly _usersRepository;

    constructor({logger, usersRepository }: InfraDependencies['deleteUserCronJobContract']){
        this._logger = logger;
        this._usersRepository = usersRepository;
    }

    public async deleteUserRoutine() : Promise<void> {
        cron.schedule(`1 0 * * *`, async () => {
            const users = this._usersRepository.find();
            const deleteUserList = users.filter((user: UserInstance) => user.inProgress.status === 'wait_to_delete');

            deleteUserList.forEach(async (user : UserInstance) => {
                const { userId, updatedAt } = user;

                const exclusionDate = Date.parse(updatedAt);

                if(daysDifference(exclusionDate) >= WAIT_TO_EXCLUSION_PERIOD){
                    await this._usersRepository.delete({ userId });
                }
            })
        });
        
      }
}