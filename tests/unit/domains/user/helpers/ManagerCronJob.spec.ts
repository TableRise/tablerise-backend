import sinon from "sinon";
import ManagerCronJob from "src/domains/users/helpers/ManagerCronJob";
import * as deleteUserCronJob from "src/domains/users/helpers/crons/deleteUserCronJob";

const ONE_MINUTE_TICK = 60000;

describe('Domains :: Users :: Helpers :: ManagerCronConJob', () => {
    context('When called', () => {
        let clock: any, 
        cronJobFunctionSpy: any,
        managerCronJob: ManagerCronJob,
        usersDetailsRepository: any,
        usersRepository: any; 

        const logger = sinon.spy(() => {});

        context('should run all jobs selected', () => {

            before(() => {
                managerCronJob = new ManagerCronJob ({
                    usersRepository,
                    usersDetailsRepository,
                    logger
                });

                cronJobFunctionSpy = sinon.spy(deleteUserCronJob,'default');
                clock = sinon.useFakeTimers((new Date()).setHours(0, 0, 0, 0));
            });

            after(() => {
                sinon.restore();
            });

            it('should return the correct result', async () => {
                await managerCronJob.run();
                expect(logger).to.have.been.called();
                expect(logger).to.have.been.calledWith('info', 'CronManager - Starting Jobs', true);
                expect(logger).to.have.been.calledWith('info', 'CronManager - All Jobs Scheduled', true);

                await clock.tickAsync(ONE_MINUTE_TICK);
                expect(cronJobFunctionSpy).to.have.been.called();
            });
        });

    });
});