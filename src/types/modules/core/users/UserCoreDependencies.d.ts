import { AddCampaignNoteOperationContract, AddCampaignNoteServiceContract } from './users/AddCampaignNote';
import { ActivateTwoFactorOperationContract, ActivateTwoFactorServiceContract } from './users/ActivateTwoFactor';
import { CreateUserOperationContract, CreateUserServiceContract } from './users/CreateUser';
import { DeactivateTwoFactorOperationContract, DeactivateTwoFactorServiceContract } from './users/DeactivateTwoFactor';
import { DeleteUserOperationContract, DeleteUserServiceContract } from './users/DeleteUser';
import { GetUserByIdOperationContract, GetUserByIdServiceContract } from './users/GetUserById';
import { GetUsersOperationContract, GetUsersServiceContract } from './users/GetUsers';
import { LoginUserOperationContract, LoginUserServiceContract } from './users/LoginUser';
import { LogoutUserOperationContract, LogoutUserServiceContract } from './users/LogoutUser';
import { PictureProfileOperationContract, PictureProfileServiceContract } from './users/PictureProfile';
import { PostSupportEmailOperationContract, PostSupportEmailServiceContract } from './users/PostSupportEmail';
import { VerifyEmailOperationContract, VerifyEmailServiceContract } from './users/VerifyEmail';
import { UpdateEmailOperationContract, UpdateEmailServiceContract } from './users/UpdateEmail';
import { UpdateUserDetailsOperationContract, UpdateUserDetailsServiceContract } from './users/UpdateUserDetails';
import { UpdatePasswordOperationContract, UpdatePasswordServiceContract } from './users/UpdatePassword';
import { UpdateUserOperationContract, UpdateUserServiceContract } from './users/UpdateUser';
import {
    GetCampaignsByUserIdOperationContract,
    GetCampaignsByUserIdServiceContract,
} from './campaigns/GetCampaignByUserId';

export default interface UserCoreDependencies {
    // Operations
    addCampaignNoteOperationContract: AddCampaignNoteOperationContract;
    activateTwoFactorOperationContract: ActivateTwoFactorOperationContract;
    deactivateTwoFactorOperationContract: DeactivateTwoFactorOperationContract;
    createUserOperationContract: CreateUserOperationContract;
    deleteUserOperationContract: DeleteUserOperationContract;
    getUserByIdOperationContract: GetUserByIdOperationContract;
    getUsersOperationContract: GetUsersOperationContract;
    logoutUserOperationContract: LogoutUserOperationContract;
    pictureProfileOperationContract: PictureProfileOperationContract;
    postSupportEmailOperationContract: PostSupportEmailOperationContract;
    updateEmailOperationContract: UpdateEmailOperationContract;
    updateUserDetailsOperationContract: UpdateUserDetailsOperationContract;
    updatePasswordOperationContract: UpdatePasswordOperationContract;
    updateUserOperationContract: UpdateUserOperationContract;
    verifyEmailOperationContract: VerifyEmailOperationContract;
    loginUserOperationContract: LoginUserOperationContract;
    getCampaignsByUserIdOperationContract: GetCampaignsByUserIdOperationContract;

    // Services
    addCampaignNoteServiceContract: AddCampaignNoteServiceContract;
    activateTwoFactorServiceContract: ActivateTwoFactorServiceContract;
    deactivateTwoFactorServiceContract: DeactivateTwoFactorServiceContract;
    createUserServiceContract: CreateUserServiceContract;
    deleteUserServiceContract: DeleteUserServiceContract;
    getUserByIdServiceContract: GetUserByIdServiceContract;
    getUsersServiceContract: GetUsersServiceContract;
    logoutUserServiceContract: LogoutUserServiceContract;
    pictureProfileServiceContract: PictureProfileServiceContract;
    postSupportEmailServiceContract: PostSupportEmailServiceContract;
    updateEmailServiceContract: UpdateEmailServiceContract;
    updateUserDetailsServiceContract: UpdateUserDetailsServiceContract;
    updatePasswordServiceContract: UpdatePasswordServiceContract;
    updateUserServiceContract: UpdateUserServiceContract;
    verifyEmailServiceContract: VerifyEmailServiceContract;
    loginUserServiceContract: LoginUserServiceContract;
    getCampaignsByUserIdServiceContract: GetCampaignsByUserIdServiceContract;
}
