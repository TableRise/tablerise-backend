import { HttpStatusCode } from 'src/domains/common/helpers/HttpStatusCode';
import DeleteUsersService from 'src/core/users/services/users/DeleteUsersService';
import { UserDetailInstance } from 'src/domains/user/schemas/userDetailsValidationSchema';
import { UserInstance } from 'src/domains/user/schemas/usersValidationSchema';
import DomainDataFaker from 'src/infra/datafakers/users/DomainDataFaker';


describe('Core :: Users :: Services :: GetUserByIdService', () => {
    let deleteUsersService: DeleteUsersService,
        usersRepository: any,
        usersDetailsRepository: any,
        user: UserInstance,
        userDetails: UserDetailInstance;

    const logger = (): void => {};

    context('#Delete', () => {
        context('When delete a user with success', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                usersRepository = { findOne: () => user, delete: () => {} };
                usersDetailsRepository = { findOne: () => userDetails, delete: () => {} };

                deleteUsersService = new DeleteUsersService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return the correct result', async () => {
                    const mockDeleteUser = async (): Promise<boolean> => {
                        await deleteUsersService.delete(user.userId);
                        return true;
                    }
                    const deleted = await mockDeleteUser();
                    console.log('gameinfo', userDetails.gameInfo.campaigns.length); 
                    expect(deleted).to.be.equal(true);
                
            });
        });
        context('When delete a user not exist', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userDetails.gameInfo.campaigns = ['Lavanda'];
                usersRepository = { findOne: () => {}, delete: () => {} };
                usersDetailsRepository = { findOne: () => {}, delete: () => {} };

                deleteUsersService = new DeleteUsersService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return HTTPRequestEroor: user-inexistent', async () => {
                try{
                    await deleteUsersService.delete(user.userId);
                }catch(err) {
                    expect(JSON.stringify(err)).to.include(HttpStatusCode.NOT_FOUND);

                }                
            });

            it('should return HTTPRequestEroor: linked-mandatory-data-when-delete', async () => {
                try{
                    await deleteUsersService.delete(user.userId);
                }catch(err) {
                    expect(JSON.stringify(err)).to.include(HttpStatusCode.UNAUTHORIZED);
                    console.log('JSON', JSON.stringify(err));

                }                
            });
        });
        context('When gameinfo campaing or character exists', () => {
            before(() => {
                user = DomainDataFaker.generateUsersJSON()[0];
                userDetails = DomainDataFaker.generateUserDetailsJSON()[0];
                userDetails.userId = user.userId;
                userDetails.gameInfo.campaigns = ['1st Mission'];
                userDetails.gameInfo.characters = ['Levi']
                usersRepository = { findOne: () => user, delete: () => {} };
                usersDetailsRepository = { findOne: () => userDetails, delete: () => {} };

                deleteUsersService = new DeleteUsersService({
                    usersRepository,
                    usersDetailsRepository,
                    logger,
                });
            });

            it('should return HTTPRequestEroor: linked-mandatory-data-when-delete', async () => {
                try{
                    await deleteUsersService.delete(user.userId);
                }catch(err) {
                    expect(JSON.stringify(err)).to.include(HttpStatusCode.UNAUTHORIZED);
                    console.log('JSON', JSON.stringify(err));

                }                
            });
        });
    });
});