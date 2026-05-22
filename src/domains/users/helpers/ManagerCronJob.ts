import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import deleteUserCronJob from './crons/deleteUserCronJob';

export default class ManagerCronJob {
    private readonly logger;
    private readonly usersRepository;
    private readonly usersDetailsRepository;

    constructor({ logger, usersRepository, usersDetailsRepository }: InfraDependencies['managerCronJobContract']) {
        this.usersRepository = usersRepository;
        this.usersDetailsRepository = usersDetailsRepository;
        this.logger = logger;
        this.run = this.run.bind(this);
    }

    public async run(): Promise<void> {
        const callName = `[${this.constructor.name}] - ${this.run.name}`;
        this.logger('info', callName);

        const deleteUserScheduleTask = await deleteUserCronJob(this.usersRepository, this.usersDetailsRepository);
        deleteUserScheduleTask.start();

        this.logger('info', 'CronManager - All Jobs Scheduled', true);
    }
}
