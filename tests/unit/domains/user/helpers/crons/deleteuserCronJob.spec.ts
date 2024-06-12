import sinon from "sinon";
import deleteUserCronJob from "src/domains/users/helpers/crons/deleteUserCronJob";
import { UserDetailInstance } from "src/domains/users/schemas/userDetailsValidationSchema";
import { UserInstance } from "src/domains/users/schemas/usersValidationSchema";
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';

describe('Domains :: Users :: Helpers :: Crons :: DeleteuserConJob', () => {
    context('When called', () => {
        let usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userToExclude: UserInstance,
        users: UserInstance[],
        userDetails: UserDetailInstance,
        userDetailsToExclude: UserDetailInstance;
        context('should delete users with more than 15 days with status wait_to_delete', () => {

            before(() => {

                user = DomainDataFaker.generateUsersJSON()[0];
                user.updatedAt = new Date().toISOString();
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];


                userToExclude = DomainDataFaker.generateUsersJSON()[0];
                userDetailsToExclude = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetailsToExclude.userId = userToExclude.userId;
                userToExclude.inProgress.status = 'wait_to_delete';
                userToExclude.updatedAt = (new Date('2023-05-10')).toISOString();
                
                users = [ user, userToExclude ];
                usersRepository = { find: () => users, delete: sinon.spy(() => [ user ]) };
                usersDetailsRepository = { delete: sinon.spy(() => [ userDetails ]) };
                
            });

            it('should return the correct result', async () => {
                await deleteUserCronJob(usersRepository, usersDetailsRepository);
                expect(usersRepository.delete).to.have.been.calledWith({ userId: userToExclude.userId });
                expect(usersDetailsRepository.delete).to.have.been.calledWith({ userId: userDetailsToExclude.userId });
                
            });
        });

    });
});