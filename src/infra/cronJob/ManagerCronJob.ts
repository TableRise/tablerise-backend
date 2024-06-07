import InfraDependencies from 'src/types/modules/infra/InfraDependencies';

export default class ManagerCronJob {
    private readonly _jobs;
    private readonly _logger;

    constructor({
        logger, 
        jobs
    }:InfraDependencies['managerCronJobContract']) {
      this._jobs = jobs;
      this._logger = logger;
      this.run = this.run.bind(this);
    }
  
    public async run(): Promise<void> {
        this._logger('info', 'CronManager - Starting Jobs');
        this._jobs.forEach((job) => { job.start() });
    }
  }
