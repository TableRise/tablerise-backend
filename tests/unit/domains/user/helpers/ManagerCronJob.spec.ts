import sinon from "sinon";
import ManagerCronJob from "src/domains/users/helpers/ManagerCronJob";


describe('Domains :: Users :: Helpers :: ManagerCronConJob', () => {
    context('When called', () => {
        let usersRepository: any,
        usersDetailsRepository: any,
        managerCronJob: ManagerCronJob;
        const logger = sinon.spy((): void => {});
        context('should run all jobs selected', () => {

            before(() => {
                managerCronJob = new ManagerCronJob ({
                    usersRepository,
                    usersDetailsRepository,
                    logger
                });
            });

            it('should return the correct result', async () => {
                await managerCronJob.run();
                expect(logger).to.have.been.called();
                expect(logger).to.have.been.calledWith('info', 'CronManager - Starting Jobs', true);
                expect(logger).to.have.been.calledWith('info', 'CronManager - All Jobs Scheduled', true);
                
            });
        });

    });
});