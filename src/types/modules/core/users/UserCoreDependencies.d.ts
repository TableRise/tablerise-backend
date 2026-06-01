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
import { ResetProfileOperationContract, ResetProfileServiceContract } from './users/ResetProfile';
import { ResetTwoFactorOperationContract, ResetTwoFactorServiceContract } from './users/ResetTwoFactor';
import { VerifyEmailOperationContract, VerifyEmailServiceContract } from './users/VerifyEmail';
import { UpdateEmailOperationContract, UpdateEmailServiceContract } from './users/UpdateEmail';
import { UpdateGameInfoOperationContract, UpdateGameInfoServiceContract } from './users/UpdateGameInfo';
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
    resetTwoFactorOperationContract: ResetTwoFactorOperationContract;
    createUserOperationContract: CreateUserOperationContract;
    deleteUserOperationContract: DeleteUserOperationContract;
    getUserByIdOperationContract: GetUserByIdOperationContract;
    getUsersOperationContract: GetUsersOperationContract;
    logoutUserOperationContract: LogoutUserOperationContract;
    pictureProfileOperationContract: PictureProfileOperationContract;
    postSupportEmailOperationContract: PostSupportEmailOperationContract;
    resetProfileOperationContract: ResetProfileOperationContract;
    updateEmailOperationContract: UpdateEmailOperationContract;
    updateGameInfoOperationContract: UpdateGameInfoOperationContract;
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
    resetTwoFactorServiceContract: ResetTwoFactorServiceContract;
    createUserServiceContract: CreateUserServiceContract;
    deleteUserServiceContract: DeleteUserServiceContract;
    getUserByIdServiceContract: GetUserByIdServiceContract;
    getUsersServiceContract: GetUsersServiceContract;
    logoutUserServiceContract: LogoutUserServiceContract;
    pictureProfileServiceContract: PictureProfileServiceContract;
    postSupportEmailServiceContract: PostSupportEmailServiceContract;
    resetProfileServiceContract: ResetProfileServiceContract;
    updateEmailServiceContract: UpdateEmailServiceContract;
    updateGameInfoServiceContract: UpdateGameInfoServiceContract;
    updateUserDetailsServiceContract: UpdateUserDetailsServiceContract;
    updatePasswordServiceContract: UpdatePasswordServiceContract;
    updateUserServiceContract: UpdateUserServiceContract;
    verifyEmailServiceContract: VerifyEmailServiceContract;
    loginUserServiceContract: LoginUserServiceContract;
    getCampaignsByUserIdServiceContract: GetCampaignsByUserIdServiceContract;
}
