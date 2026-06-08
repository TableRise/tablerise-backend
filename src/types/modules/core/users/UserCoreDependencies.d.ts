import { AddCampaignNoteOperationContract, AddCampaignNoteServiceContract } from './users/AddCampaignNote';
import { ActivateTwoFactorOperationContract, ActivateTwoFactorServiceContract } from './users/ActivateTwoFactor';
import { CreateUserOperationContract, CreateUserServiceContract } from './users/CreateUser';
import { DeactivateTwoFactorOperationContract, DeactivateTwoFactorServiceContract } from './users/DeactivateTwoFactor';
import { DeleteUserOperationContract, DeleteUserServiceContract } from './users/DeleteUser';
import { FriendsOperationContract, FriendsServiceContract } from './users/Friends';
import { GalleryOperationContract, GalleryServiceContract } from './users/Gallery';
import { GetUserByIdOperationContract, GetUserByIdServiceContract } from './users/GetUserById';
import {
    GetUserByNicknameAndTagOperationContract,
    GetUserByNicknameAndTagServiceContract,
} from './users/GetUserByNicknameAndTag';
import { GetUsersOperationContract, GetUsersServiceContract } from './users/GetUsers';
import { LoginUserOperationContract, LoginUserServiceContract } from './users/LoginUser';
import { LogoutUserOperationContract, LogoutUserServiceContract } from './users/LogoutUser';
import { MessagesOperationContract, MessagesServiceContract } from './users/Messages';
import { PictureProfileOperationContract, PictureProfileServiceContract } from './users/PictureProfile';
import { PostSupportEmailOperationContract, PostSupportEmailServiceContract } from './users/PostSupportEmail';
import { RegisterDonationOperationContract, RegisterDonationServiceContract } from './users/RegisterDonation';
import { RemoveUserCoverOperationContract, RemoveUserCoverServiceContract } from './users/RemoveUserCover';
import { VerifyEmailOperationContract, VerifyEmailServiceContract } from './users/VerifyEmail';
import { UpdateEmailOperationContract, UpdateEmailServiceContract } from './users/UpdateEmail';
import { UpdateUserCoverOperationContract, UpdateUserCoverServiceContract } from './users/UpdateUserCover';
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
    friendsOperationContract: FriendsOperationContract;
    galleryOperationContract: GalleryOperationContract;
    getUserByIdOperationContract: GetUserByIdOperationContract;
    getUserByNicknameAndTagOperationContract: GetUserByNicknameAndTagOperationContract;
    getUsersOperationContract: GetUsersOperationContract;
    logoutUserOperationContract: LogoutUserOperationContract;
    messagesOperationContract: MessagesOperationContract;
    pictureProfileOperationContract: PictureProfileOperationContract;
    postSupportEmailOperationContract: PostSupportEmailOperationContract;
    registerDonationOperationContract: RegisterDonationOperationContract;
    removeUserCoverOperationContract: RemoveUserCoverOperationContract;
    updateEmailOperationContract: UpdateEmailOperationContract;
    updateUserCoverOperationContract: UpdateUserCoverOperationContract;
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
    friendsServiceContract: FriendsServiceContract;
    galleryServiceContract: GalleryServiceContract;
    getUserByIdServiceContract: GetUserByIdServiceContract;
    getUserByNicknameAndTagServiceContract: GetUserByNicknameAndTagServiceContract;
    getUsersServiceContract: GetUsersServiceContract;
    logoutUserServiceContract: LogoutUserServiceContract;
    messagesServiceContract: MessagesServiceContract;
    pictureProfileServiceContract: PictureProfileServiceContract;
    postSupportEmailServiceContract: PostSupportEmailServiceContract;
    registerDonationServiceContract: RegisterDonationServiceContract;
    removeUserCoverServiceContract: RemoveUserCoverServiceContract;
    updateEmailServiceContract: UpdateEmailServiceContract;
    updateUserCoverServiceContract: UpdateUserCoverServiceContract;
    updateUserDetailsServiceContract: UpdateUserDetailsServiceContract;
    updatePasswordServiceContract: UpdatePasswordServiceContract;
    updateUserServiceContract: UpdateUserServiceContract;
    verifyEmailServiceContract: VerifyEmailServiceContract;
    loginUserServiceContract: LoginUserServiceContract;
    getCampaignsByUserIdServiceContract: GetCampaignsByUserIdServiceContract;
}
