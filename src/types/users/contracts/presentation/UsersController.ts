import ActivateSecretQuestionOperation from 'src/core/users/operations/users/ActivateSecretQuestionOperation';
import ActivateTwoFactorOperation from 'src/core/users/operations/users/ActivateTwoFactorOperation';
import ConfirmCodeOperation from 'src/core/users/operations/users/ConfirmCodeOperation';
import CreateUserOperation from 'src/core/users/operations/users/CreateUserOperation';
import DeleteUserOperation from 'src/core/users/operations/users/DeleteUserOperation';
import GetUserByIdOperation from 'src/core/users/operations/users/GetUserByIdOperation';
import GetUsersOperation from 'src/core/users/operations/users/GetUsersOperation';
import ResetProfileOperation from 'src/core/users/operations/users/ResetProfileOperation';
import UpdateEmailOperation from 'src/core/users/operations/users/UpdateEmailOperation';
import UpdateGameInfoOperation from 'src/core/users/operations/users/UpdateGameInfoOperation';
import UpdatePasswordOperation from 'src/core/users/operations/users/UpdatePasswordOperation';
import UpdateSecretQuestionOperation from 'src/core/users/operations/users/UpdateSecretQuestionOperation';
import UpdateUserOperation from 'src/core/users/operations/users/UpdateUserOperation';
import VerifyEmailOperation from 'src/core/users/operations/users/VerifyEmailOperation';

export interface UsersControllerContract {
    createUserOperation: CreateUserOperation;
    updateUserOperation: UpdateUserOperation;
    verifyEmailOperation: VerifyEmailOperation;
    getUsersOperation: GetUsersOperation;
    getUserByIdOperation: GetUserByIdOperation;
    confirmCodeOperation: ConfirmCodeOperation;
    activateSecretQuestionOperation: ActivateSecretQuestionOperation;
    activateTwoFactorOperation: ActivateTwoFactorOperation;
    updateEmailOperation: UpdateEmailOperation;
    updateSecretQuestionOperation: UpdateSecretQuestionOperation;
    updatePasswordOperation: UpdatePasswordOperation;
    updateGameInfoOperation: UpdateGameInfoOperation;
    resetProfileOperation: ResetProfileOperation;
    deleteUserOperation: DeleteUserOperation;
}
