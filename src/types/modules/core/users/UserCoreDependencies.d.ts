import { ActivateSecretQuestionOperationContract, ActivateSecretQuestionServiceContract } from './users/ActivateSecretQuestion'
import { ActivateTwoFactorOperationContract, ActivateTwoFactorServiceContract } from './users/ActivateTwoFactor';
import { ConfirmEmailOperationContract, ConfirmEmailServiceContract } from './users/ConfirmEmail';
import { CreateUserOperationContract, CreateUserServiceContract } from './users/CreateUser';
import { DeleteUserOperationContract, DeleteUserServiceContract } from './users/DeleteUser';
import { GetUserByIdOperationContract, GetUserByIdServiceContract } from './users/GetUserById';
import { GetUsersOperationContract, GetUsersServiceContract } from './users/GetUsers';
import { LogoutUserOperationContract, LogoutUserServiceContract } from './users/LogoutUser';
import { PictureProfileOperationContract, PictureProfileServiceContract } from './users/PictureProfile';
import { ResetProfileOperationContract, ResetProfileServiceContract } from './users/ResetProfile';

export default interface UserCoreDependencies {
    // Operations
    activateSecretQuestionOperationContract: ActivateSecretQuestionOperationContract;
    activateTwoFactorOperationContract: ActivateTwoFactorOperationContract;
    confirmEmailOperationContract: ConfirmEmailOperationContract;
    createUserOperationContract: CreateUserOperationContract;
    deleteUserOperationContract: DeleteUserOperationContract;
    getUserByIdOperationContract: GetUserByIdOperationContract;
    getUsersOperationContract: GetUsersOperationContract;
    logoutUserOperationContract: LogoutUserOperationContract;
    pictureProfileOperationContract: PictureProfileOperationContract;
    resetProfileOperationContract: ResetProfileOperationContract;
    updateEmailOperationContract: UpdateEmailOperationContract;
    updateGameInfoOperationContract: UpdateGameInfoOperationContract;
    updatePasswordOperationContract: UpdatePasswordOperationContract;
    updateSecretQuestionOperationContract: UpdateSecretQuestionOperationContract;
    updateUserOperationContract: UpdateUserOperationContract;
    verifyEmailOperationContract: VerifyEmailOperationContract;

    // Services
    activateSecretQuestionServiceContract: ActivateSecretQuestionServiceContract;
    activateTwoFactorServiceContract: ActivateTwoFactorServiceContract;
    confirmEmailServiceContract: ConfirmEmailServiceContract;
    createUserServiceContract: CreateUserServiceContract;
    deleteUserServiceContract: DeleteUserServiceContract;
    getUserByIdServiceContract: GetUserByIdServiceContract;
    getUsersServiceContract: GetUsersServiceContract;
    logoutUserServiceContract: LogoutUserServiceContract;
    pictureProfileServiceContract: PictureProfileServiceContract;
    resetProfileServiceContract: ResetProfileServiceContract;
    updateEmailServiceContract: UpdateEmailServiceContract;
    updateGameInfoServiceContract: UpdateGameInfoServiceContract;
    updatePasswordServiceContract: UpdatePasswordServiceContract;
    updateSecretQuestionServiceContract: UpdateSecretQuestionServiceContract;
    updateUserServiceContract: UpdateUserServiceContract;
    verifyEmailServiceContract: VerifyEmailServiceContract;
}