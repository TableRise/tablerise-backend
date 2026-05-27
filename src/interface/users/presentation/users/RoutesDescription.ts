const getAll = 'List all registered users.';

const get = 'Get a user by id.';

const getCampaigns = 'List the campaigns that belong to a specific user.';

const verify = 'Send an email verification code for the requested authentication or account flow.';

const register = 'Create a new user account. Email verification is required before protected actions.';

const login = 'Sign in with email and password and return the authenticated session data.';

const update = 'Update the allowed profile fields for a user.';

const updateDetails = 'Update the allowed user detail fields for a user.';

const confirm = 'Confirm a recently created account with the code sent by email.';

const activate2FA = 'Enable two-factor authentication and return the setup data.';

const deactivate2FA = 'Disable the user two-factor authentication after the deactivation flow is completed.';

const reset2FA = 'Reset the user two-factor authentication setup.';

const updateEmail = 'Change the user email address. A verification flow is required.';

const updatePassword = 'Reset the user password using the email verification flow and any enabled extra checks.';

const addGameInfo = 'Add a campaign, character, or badge reference to the user game info.';

const removeGameInfo = 'Remove a campaign, character, or badge reference from the user game info.';

const updateCampaignNotes = 'Add a note to one campaign inside the user game info.';

const resetProfile = 'Clear the user characters, campaigns, and badges.';

const profilePicture = 'Upload or replace the user profile picture. Accepted formats: PNG and JPEG.';

const deleteProfile = 'Delete a user account.';

const logoutUser = 'Sign out the current user and invalidate the current token.';

const emailCode = 'Validate an email verification code for the requested flow.';

const token2FA = 'Validate a two-factor authentication token for the requested flow.';

export default {
    get,
    getAll,
    getCampaigns,
    register,
    verify,
    login,
    update,
    updateDetails,
    activate2FA,
    deactivate2FA,
    reset2FA,
    confirm,
    updateEmail,
    updatePassword,
    addGameInfo,
    removeGameInfo,
    updateCampaignNotes,
    resetProfile,
    profilePicture,
    deleteProfile,
    logoutUser,
    emailCode,
    token2FA,
};
