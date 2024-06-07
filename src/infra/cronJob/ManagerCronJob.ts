import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import DeleteUserCronJob from './DeleteUserCronJob';

export default class ManagerCronJob {
    private readonly _logger;
    private readonly _usersRepository;

    constructor({
        logger, 
        usersRepository,
    }:InfraDependencies['managerCronJobContract']) {
      this._usersRepository = usersRepository;
      this._logger = logger;
      this.run = this.run.bind(this);
    }
  
    public async run(): Promise<void> {
        this._logger('info', 'CronManager - Starting Jobs');
        console.log("SOCORRO22222222222!!!!!!");
        const logger = this._logger;
        const usersRepository = this._usersRepository; 
        const job = new DeleteUserCronJob({ logger, usersRepository });
        await job.deleteUserDaily();
    }
  }
