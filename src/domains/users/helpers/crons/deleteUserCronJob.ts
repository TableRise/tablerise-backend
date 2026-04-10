import logger from '@tablerise/dynamic-logger';
import daysDifference from 'src/domains/common/helpers/daysDifference';
import User from '@tablerise/database-management/dist/src/interfaces/User';
import UsersRepository from '../../../../infra/repositories/user/UsersRepository';
import UsersDetailsRepository from 'src/infra/repositories/user/UsersDetailsRepository';
import cron, { ScheduledTask } from 'node-cron';
import InProgressStatusEnum from '../../enums/InProgressStatusEnum';

export default async function deleteUserCronJob(
    usersRepository: UsersRepository,
    usersDetailsRepository: UsersDetailsRepository
): Promise<ScheduledTask> {
    const deleteUserScheduleTask = cron.schedule('1 0 * * *', async () => {
        logger('info', 'DeleteUserCronJob - Starting deleteUserDaily Routine');

        const users = await usersRepository.find();
        const deleteUserList = users.filter(
            (user: User) => user.inProgress.status === InProgressStatusEnum.enum.WAIT_TO_DELETE_USER
        );

        deleteUserList.forEach(async (user: User) => {
            const { userId, updatedAt } = user;

            const exclusionDate = Date.parse(updatedAt);
            const WAIT_TO_EXCLUSION_PERIOD = 15;

            if (daysDifference(exclusionDate, WAIT_TO_EXCLUSION_PERIOD)) {
                await usersRepository.delete({ userId });
                await usersDetailsRepository.delete({ userId });
                logger('info', `DeleteUserCronJob - userDeleted - ${userId} --- ${user.nickname}`, true);
            }
        });
    });

    return deleteUserScheduleTask;
}
