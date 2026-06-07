const getAll = 'List all registered users.';

const get = 'Get a user by id.';

const currentUser = 'Get the currently authenticated user using the active cookie session.';

const getCampaigns = 'List the campaigns that belong to a specific user.';
const getMessages = 'List every message stored for the authenticated user.';
const getMessageById = 'Get one stored message by message id for the authenticated user.';
const markMessageAsRead = 'Mark one stored message as read for the authenticated user.';
const getGallery = 'List the uploaded gallery items stored for the authenticated user.';
const getGalleryImage = 'Get one stored gallery image by image id for the authenticated user.';
const getFriends = 'List the stored friends and pending friend requests for the authenticated user.';
const getFriendById = 'Get one friend or pending request by target user id for the authenticated user.';

const verify = 'Send an email verification code for the requested authentication or account flow.';

const register = 'Create a new user account. Email verification is required before protected actions.';

const login = 'Sign in with email and password and return the authenticated session data.';
const postMessage = 'Send a message to an active friend and store it in the target user inbox.';
const postFriendRequest = 'Create a pending friend request for the target user.';

const postSupportEmail = 'Send an authenticated support email to the TableRise support inbox.';

const postDonate =
    'Register a donation intent for the authenticated user, optionally sending the request for manual validation.';

const update = 'Update the allowed profile fields for a user.';

const updateDetails = 'Update the allowed user detail fields for a user.';

const confirm = 'Confirm a recently created account with the code sent by email.';

const activate2FA = 'Enable two-factor authentication and return the setup data.';

const deactivate2FA = 'Disable the user two-factor authentication after the deactivation flow is completed.';

const updateEmail = 'Change the user email address. A verification flow is required.';

const updatePassword = 'Reset the user password using the email verification flow and any enabled extra checks.';

const updateCampaignNotes = 'Add a note to one campaign inside the user game info.';
const acceptFriendRequest = 'Accept or decline a pending friend request for the authenticated user.';
const removeFriend = 'Remove a friend entry or pending request for the authenticated user.';

const profilePicture = 'Upload or replace the user profile picture. Accepted formats: PNG and JPEG.';

const updateUserCover = 'Upload or replace the user details cover image. Accepted formats: PNG and JPEG.';

const removeUserCover = 'Remove the user details cover image.';
const deleteMessage = 'Delete one stored message for the authenticated user.';
const deleteGalleryImage = 'Delete one stored gallery image for the authenticated user.';

const deleteProfile = 'Delete a user account.';

const logoutUser = 'Sign out the current user and invalidate the current token.';

const emailCode = 'Validate an email verification code for the requested flow.';

const token2FA = 'Validate a two-factor authentication token for the requested flow.';

export default {
    get,
    currentUser,
    getAll,
    getCampaigns,
    getMessages,
    getMessageById,
    markMessageAsRead,
    getGallery,
    getGalleryImage,
    getFriends,
    getFriendById,
    register,
    verify,
    login,
    postMessage,
    postFriendRequest,
    postSupportEmail,
    postDonate,
    update,
    updateDetails,
    activate2FA,
    deactivate2FA,
    confirm,
    updateEmail,
    updatePassword,
    updateCampaignNotes,
    acceptFriendRequest,
    removeFriend,
    profilePicture,
    updateUserCover,
    removeUserCover,
    deleteMessage,
    deleteGalleryImage,
    deleteProfile,
    logoutUser,
    emailCode,
    token2FA,
};
