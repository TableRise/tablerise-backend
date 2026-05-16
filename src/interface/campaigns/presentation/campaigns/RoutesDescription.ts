const create = 'Create a new campaign and return the saved campaign data.';
const deleteCampaign = 'Delete a campaign. This action is only available to the dungeon master.';
const update = 'Update the main campaign information.';
const getById = 'Get a campaign by its id.';
const getAll = 'List campaigns, with optional filters by title or code.';
const addMatchImages = 'Add map images to the active match.';
const removeMatchImage = 'Remove one map image from the active match.';
const addMatchMusic = 'Add a music track to the active match.';
const removeMatchMusic = 'Remove a music track from the active match.';
const editMatchMusic = 'Edit one music track from the active match.';
const addMatchDate = 'Set the next scheduled match date for the campaign.';
const removeMatchDate = 'Remove the next scheduled match date from the campaign.';
const publishment = 'Create a new journal post for the campaign.';
const addCampaignPlayers = 'Add a player to the campaign.';
const removeCampaignPlayers = 'Remove a player from the campaign.';
const inviteEmail = 'Send a campaign invitation by email.';
const postCampaignLog = 'Add a new entry to the campaign log.';
const addPlayerCharacter = 'Assign a character to a player in the campaign.';
const removePlayerCharacter = 'Remove a player character from the campaign.';
const getCampaignCharacters = 'List all characters currently linked to the campaign.';
const getCampaignPlayers = 'List all players currently linked to the campaign.';
const getCampaignJournalPosts = 'List all journal posts for the campaign.';
const getCampaignJournalHighlight = 'Get the highlighted journal post for the campaign.';
const getCharactersByPlayer = 'List the authenticated player characters available in the campaign.';
const confirmCampaignPlayer =
    'Approve a pending player in the campaign. Available to the dungeon master or an admin player.';
const confirmPlayerPresence = 'Confirm or cancel the authenticated player presence for the next match.';
const updateCampaignPlayerLimit = 'Update the maximum number of players allowed in the campaign.';
const updateCampaignCover = 'Upload or replace the campaign cover image.';
const removeCampaignCover = 'Remove the campaign cover image.';
const transferDungeonMaster = 'Transfer the dungeon master role to another player in the campaign.';
const updateMatchCharacterPicture = 'Upload or replace a character token for the active match.';
const updateCampaignJournalHighlight =
    'Set or update the highlighted journal post. Available to the dungeon master or an admin player.';
const updateCampaignJournalPost = 'Edit a campaign journal post. Available to the post author.';
const deleteCampaignJournalPost =
    'Delete a campaign journal post. Available to the post author, an admin player, or the dungeon master.';

export default {
    create,
    deleteCampaign,
    update,
    getById,
    getAll,
    addMatchImages,
    removeMatchImage,
    addMatchMusic,
    removeMatchMusic,
    editMatchMusic,
    addMatchDate,
    removeMatchDate,
    publishment,
    addCampaignPlayers,
    removeCampaignPlayers,
    inviteEmail,
    postCampaignLog,
    addPlayerCharacter,
    removePlayerCharacter,
    getCampaignCharacters,
    getCampaignPlayers,
    getCampaignJournalPosts,
    getCampaignJournalHighlight,
    getCharactersByPlayer,
    confirmCampaignPlayer,
    confirmPlayerPresence,
    updateCampaignPlayerLimit,
    updateCampaignCover,
    removeCampaignCover,
    transferDungeonMaster,
    updateMatchCharacterPicture,
    updateCampaignJournalHighlight,
    updateCampaignJournalPost,
    deleteCampaignJournalPost,
};
