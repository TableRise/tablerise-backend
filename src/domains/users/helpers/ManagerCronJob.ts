import InfraDependencies from 'src/types/modules/infra/InfraDependencies';
import deleteUserCronJob from './crons/deleteUserCronJob';


export default class ManagerCronJob {
    private readonly _logger;
    private readonly _usersRepository;
    private

    constructor({
        logger, 
        usersRepository,
    }:InfraDependencies['managerCronJobContract']) {
      this._usersRepository = usersRepository;
      this._logger = logger;
      this.run = this.run.bind(this);
    }
  
    public async run(): Promise<void> {
        this._logger('info', 'CronManager - Starting Jobs', true);
        await deleteUserCronJob(this._usersRepository);
    }
  }
