import ActivateTwoFactorOperation from 'src/core/users/operations/users/ActivateTwoFactorOperation';
import ConfirmCodeOperation from 'src/core/users/operations/users/ConfirmCodeOperation';
import CreateUserOperation from 'src/core/users/operations/users/CreateUserOperation';
import DeleteUserOperation from 'src/core/users/operations/users/DeleteUserOperation';
import GetUserByIdOperation from 'src/core/users/operations/users/GetUserByIdOperation';
import GetUsersOperation from 'src/core/users/operations/users/GetUsersOperation';
import ResetProfileOperation from 'src/core/users/operations/users/ResetProfileOperation';
import ResetTwoFactorOperation from 'src/core/users/operations/users/ResetTwoFactorOperation';
import UpdateEmailOperation from 'src/core/users/operations/users/UpdateEmailOperation';
import UpdateGameInfoOperation from 'src/core/users/operations/users/UpdateGameInfoOperation';
import UpdateUserOperation from 'src/core/users/operations/users/UpdateUserOperation';
import VerifyEmailOperation from 'src/core/users/operations/users/VerifyEmailOperation';

export interface UsersControllerContract {
    createUserOperation: CreateUserOperation;
    updateUserOperation: UpdateUserOperation;
    verifyEmailOperation: VerifyEmailOperation;
    getUsersOperation: GetUsersOperation;
    getUserByIdOperation: GetUserByIdOperation;
    confirmCodeOperation: ConfirmCodeOperation;
    activateTwoFactorOperation: ActivateTwoFactorOperation;
    resetTwoFactorOperation: ResetTwoFactorOperation;
    updateEmailOperation: UpdateEmailOperation;
    updateGameInfoOperation: UpdateGameInfoOperation;
    resetProfileOperation: ResetProfileOperation;
    deleteUserOperation: DeleteUserOperation;
}
