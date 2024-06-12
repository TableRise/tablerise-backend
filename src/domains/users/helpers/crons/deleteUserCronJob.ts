import logger from '@tablerise/dynamic-logger';
import daysDifference from 'src/domains/common/helpers/daysDifference';
import { UserInstance } from 'src/domains/users/schemas/usersValidationSchema';
import UsersRepository from '../../../../infra/repositories/user/UsersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';

export default async function  deleteUserCronJob(usersRepository: UsersRepository, usersDetailsRepository: UsersDetailsRepository) : Promise<void> {
        logger('info', 'DeleteUserCronJob - Starting deleteUserDaily Routine');
        
        const users = await usersRepository.find();
        const deleteUserList = users.filter((user: UserInstance) => user.inProgress.status === 'wait_to_delete');
        
        deleteUserList.forEach(async (user : UserInstance) => {
            const { userId, updatedAt } = user;

            const exclusionDate = Date.parse(updatedAt);
            const WAIT_TO_EXCLUSION_PERIOD = 15;
            
            if(daysDifference(exclusionDate, WAIT_TO_EXCLUSION_PERIOD)){
                await usersRepository.delete({ userId });
                await usersDetailsRepository.delete({ userId });
                logger('info', `DeleteUserCronJob - userDeleted - ${userId} --- ${user.nickname}`, true);
            }
        })
    
    }
