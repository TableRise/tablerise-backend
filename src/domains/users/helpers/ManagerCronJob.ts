import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import deleteUserCronJob from './crons/deleteUserCronJob';
import cron from "node-cron";


export default class ManagerCronJob {
    private readonly _logger;
    private readonly _usersRepository;
    private readonly _usersDetailsRepository;

    constructor({
        logger, 
        usersRepository,
        usersDetailsRepository
    }:InfraDependencies['managerCronJobContract']) {
      this._usersRepository = usersRepository;
      this._usersDetailsRepository = usersDetailsRepository;
      this._logger = logger;
      this.run = this.run.bind(this);
    }
  
    public async run(): Promise<void> {
        this._logger('info', 'CronManager - Starting Jobs', true);

        cron.schedule('0 1 * * *', async () => deleteUserCronJob(this._usersRepository, this._usersDetailsRepository));

        this._logger('info', 'CronManager - All Jobs Scheduled', true);
    }
    
}
  
