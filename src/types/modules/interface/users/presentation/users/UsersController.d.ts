import ActivateSecretQuestionOperation from 'src/core/users/operations/users/ActivateSecretQuestionOperation';
import ActivateTwoFactorOperation from 'src/core/users/operations/users/ActivateTwoFactorOperation';
import CreateUserOperation from 'src/core/users/operations/users/CreateUserOperation';
import DeleteUserOperation from 'src/core/users/operations/users/DeleteUserOperation';
import GetUserByIdOperation from 'src/core/users/operations/users/GetUserByIdOperation';
import GetUsersOperation from 'src/core/users/operations/users/GetUsersOperation';
import PictureProfileOperation from 'src/core/users/operations/users/PictureProfileOperation';
import ResetProfileOperation from 'src/core/users/operations/users/ResetProfileOperation';
import UpdateEmailOperation from 'src/core/users/operations/users/UpdateEmailOperation';
import UpdateGameInfoOperation from 'src/core/users/operations/users/UpdateGameInfoOperation';
import UpdatePasswordOperation from 'src/core/users/operations/users/UpdatePasswordOperation';
import UpdateUserOperation from 'src/core/users/operations/users/UpdateUserOperation';
import VerifyEmailOperation from 'src/core/users/operations/users/VerifyEmailOperation';
import LogoutUserOperation from 'src/core/users/operations/users/LogoutUserOperation';
import LoginUserOperation from 'src/core/users/operations/users/LoginUserOperation';
import ResetTwoFactorOperation from 'src/core/users/operations/users/ResetTwoFactorOperation';
import UpdateSecretQuestionOperation from 'src/core/users/operations/users/UpdateSecretQuestionOperation';

export interface UsersControllerContract {
    createUserOperation: CreateUserOperation;
    updateUserOperation: UpdateUserOperation;
    verifyEmailOperation: VerifyEmailOperation;
    getUsersOperation: GetUsersOperation;
    getUserByIdOperation: GetUserByIdOperation;
    activateSecretQuestionOperation: ActivateSecretQuestionOperation;
    updateSecretQuestionOperation: UpdateSecretQuestionOperation;
    activateTwoFactorOperation: ActivateTwoFactorOperation;
    resetTwoFactorOperation: ResetTwoFactorOperation;
    updateEmailOperation: UpdateEmailOperation;
    updatePasswordOperation: UpdatePasswordOperation;
    updateGameInfoOperation: UpdateGameInfoOperation;
    resetProfileOperation: ResetProfileOperation;
    pictureProfileOperation: PictureProfileOperation;
    deleteUserOperation: DeleteUserOperation;
    logoutUserOperation: LogoutUserOperation;
    loginUserOperation: LoginUserOperation;
}
