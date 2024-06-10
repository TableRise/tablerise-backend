import logger from '@tablerise/dynamic-logger';
import cron from 'node-cron';
import daysDifference from 'src/domains/common/helpers/daysDifference';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import UsersRepository from '../../../../infra/repositories/user/UsersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

const WAIT_TO_EXCLUSION_PERIOD = 15;

export default async function  deleteUserCronJob(usersRepository: UsersRepository, usersDetailsRepository: UsersDetailsRepository) : Promise<void> {
        cron.schedule(`1 0 * * *`, async () => {
            logger('info', 'DeleteUserCronJob - Starting deleteUserDaily Routine');
            
            const users = await usersRepository.find();
            const deleteUserList = users.filter((user: UserInstance) => user.inProgress.status === 'wait_to_delete');
          
            deleteUserList.forEach(async (user : UserInstance) => {
                const { userId, updatedAt } = user;

                const exclusionDate = Date.parse(updatedAt);

                if(daysDifference(exclusionDate, WAIT_TO_EXCLUSION_PERIOD)){
                    await usersRepository.delete({ userId });
                    logger('info', `DeleteUserCronJob - userDeleted - ${userId} --- ${user.nickname}`, true);
                }
            })
        });
        
      }
